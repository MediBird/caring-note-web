import '@/assets/css/DraftJsCss.css';
import Tooltip from '@/components/Tooltip';
import eraserBlack from '@/assets/icon/24/erase.outlined.black.svg';
import highlightpenBlack from '@/assets/icon/24/highlighter.outlined.black.svg';
import {
  Editor,
  EditorState,
  Modifier,
  ContentState,
  SelectionState,
  ContentBlock,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { useCallback, useEffect } from 'react';
import { useSelectMedicineConsult } from '@/hooks/useMedicineConsultQuery';
import { useMedicineConsultStore } from '@/store/medicineConsultStore';
import { useParams } from 'react-router-dom';
import { CounselRecordHighlights } from '@/types/MedicineConsultDTO';
import useCounselRecordEditorStateStore from '@/store/counselRecordEditorStateStore';

const HighlightInput: React.FC = () => {
  const { editorState, setEditorState } = useCounselRecordEditorStateStore();

  const { counselSessionId } = useParams();
  const { setMedicationConsult, setCounselRecordHighlights, setCounselRecord } =
    useMedicineConsultStore();

  const { data } = useSelectMedicineConsult(counselSessionId);

  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: '#FFBD14',
    },
    CLEAR: {
      backgroundColor: '#FFFFFF',
    },
  };

  useEffect(() => {
    if (data) {
      setMedicationConsult({
        counselSessionId: counselSessionId || '',
        medicationCounselId: data.medicationCounselId || '',
        counselRecord: data.counselRecord || '',
        counselRecordHighlights: data.counselRecordHighlights || [],
      });

      // ContentState 초기화
      const contentState = ContentState.createFromText(
        data.counselRecord || '',
      );

      // 특정 하이라이트 설정 (데이터가 있다면 처리)
      let contentStateWithHighlight = contentState;

      if (data.counselRecordHighlights?.length && data.counselRecord) {
        // reduce를 사용하여 순차적으로 하이라이트 적용
        contentStateWithHighlight = data.counselRecordHighlights.reduce(
          (currentContent, highlight) => {
            const start = highlight.startIndex;
            const end = highlight.endIndex;

            if (start === -1) return currentContent;

            try {
              let offset = 0;
              let targetBlock: ContentBlock | null = null;
              let targetStart = start;
              let targetEnd = end;

              const blocks = currentContent.getBlockMap().toArray();
              for (const block of blocks) {
                const length = block.getLength();
                if (start >= offset && start < offset + length) {
                  targetBlock = block;
                  targetStart = start - offset;
                  targetEnd = end - offset;
                  break;
                }
                offset += length + 1;
              }

              if (!targetBlock) return currentContent;

              const blockKey = targetBlock.getKey();
              const selectionState = SelectionState.createEmpty(blockKey).merge(
                {
                  anchorOffset: targetStart,
                  focusOffset: targetEnd,
                  hasFocus: true,
                },
              );

              return Modifier.applyInlineStyle(
                currentContent,
                selectionState,
                'HIGHLIGHT',
              );
            } catch (error) {
              console.error('하이라이트 스타일 적용 중 오류 발생:', error);
              return currentContent;
            }
          },
          contentState,
        );
      }

      const newEditorState = EditorState.createWithContent(
        contentStateWithHighlight,
      );

      setEditorState(newEditorState);
    }
  }, [data, setEditorState, setMedicationConsult, counselSessionId]);

  // 하이라이트 버튼 핸들러
  const applyHighlight = () => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    if (selectionState.isCollapsed()) return;

    const newContentState = Modifier.applyInlineStyle(
      contentState,
      selectionState,
      'HIGHLIGHT',
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-inline-style',
    );

    setEditorState(newEditorState);
  };

  // 하이라이트 버튼 핸들러
  const removeHighlight = () => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    if (selectionState.isCollapsed()) return;

    const newContentState = Modifier.removeInlineStyle(
      contentState,
      selectionState,
      'HIGHLIGHT',
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-inline-style',
    );

    setEditorState(newEditorState);
  };

  // 현재 하이라이트된 텍스트 추출
  const getHighlightedText = useCallback((): CounselRecordHighlights[] => {
    const contentState = editorState.getCurrentContent();
    const highlights: CounselRecordHighlights[] = [];
    let totalOffset = 0;

    contentState.getBlockMap().forEach((block) => {
      if (!block) return;

      const text = block.getText();
      const charList = block.getCharacterList();
      let currentHighlight = '';
      let startIndex = -1;

      // 각 문자의 스타일을 확인
      for (let i = 0; i < text.length; i++) {
        const hasHighlight = charList.get(i).hasStyle('HIGHLIGHT');

        if (hasHighlight) {
          if (startIndex === -1) {
            startIndex = totalOffset + i;
            currentHighlight = text[i];
          } else {
            currentHighlight += text[i];
          }
        } else if (startIndex !== -1) {
          highlights.push({
            startIndex,
            endIndex: totalOffset + i,
            highlight: currentHighlight,
          });
          currentHighlight = '';
          startIndex = -1;
        }
      }

      // 블록 끝에서 하이라이트가 끝나는 경우 처리
      if (startIndex !== -1) {
        highlights.push({
          startIndex,
          endIndex: totalOffset + text.length,
          highlight: currentHighlight,
        });
      }

      // 다음 블록을 위한 오프셋 업데이트 (줄바꿈 문자 고려)
      totalOffset += text.length + 1;
    });

    return highlights;
  }, [editorState]);

  useEffect(() => {
    setCounselRecordHighlights(getHighlightedText() || []);
  }, [setCounselRecordHighlights, getHighlightedText]);

  return (
    <div className="p-0 rounded-lg bg-white border-2 border-gray-300">
      <div
        className="border-b p-2 min-h-64"
        onClick={() => getHighlightedText()}>
        <Editor
          editorState={editorState}
          placeholder={`상담 내용을 기록하세요`}
          onChange={(editorState) => {
            setEditorState(editorState);
            setCounselRecord(editorState.getCurrentContent().getPlainText());
          }}
          customStyleMap={styleMap}
        />
      </div>
      <div className="flex items-center">
        <img
          className="w-8 h-8 cursor-pointer m-2 inline-block"
          src={highlightpenBlack}
          alt="하이라이트"
          onClick={applyHighlight}
        />
        <img
          className="w-8 h-8 cursor-pointer inline-block"
          src={eraserBlack}
          alt="하이라이트 지우기"
          onClick={removeHighlight}
        />
        <Tooltip
          className="ml-2"
          id="highlight"
          text={`왼쪽 형광펜으로 원하는 내용을 강조하고, 
          오른쪽 지우개로 다시 지울 수 있어요`}
          eventType="hover"
          key={'highlight'}
          place="right"
        />
      </div>
    </div>
  );
};

export default HighlightInput;
