import '@/assets/css/DraftJsCss.css';
import eraserBlack from '@/assets/icon/eraserBlack.png';
import eraserBlue from '@/assets/icon/eraserBlue.png';
import highlightpenBlack from '@/assets/icon/highlightpenBlack.png';
import highlightpenBlue from '@/assets/icon/highlightpenBlue.png';
import Tooltip from '@/components/Tooltip';
import { cn } from '@/lib/utils';
import { useSelectMedicineConsult } from '@/pages/Consult/hooks/query/useMedicineConsultQuery';
import useCounselRecordEditorStateStore from '@/store/counselRecordEditorStateStore';
import { useMedicineConsultStore } from '@/store/medicineConsultStore';
import { CounselRecordHighlights } from '@/types/MedicineConsultDTO';
import {
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  Modifier,
  SelectionState,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface HighlightInputProps {
  className?: string;
}

const HighlightInput: React.FC<HighlightInputProps> = ({ className }) => {
  const { editorState, setEditorState } = useCounselRecordEditorStateStore();

  const { counselSessionId } = useParams();
  const {
    setMedicationConsult,
    setCounselRecordHighlights,
    setCounselRecord,
    isEditorInitialized,
    setEditorInitialized,
  } = useMedicineConsultStore();

  const { data } = useSelectMedicineConsult(counselSessionId);

  const [isHoverHighlightButton, setIsHoverHighlightButton] = useState(false);
  const [isHoverEraserButton, setIsHoverEraserButton] = useState(false);

  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: '#FFBD14',
    },
    CLEAR: {
      backgroundColor: '#FFFFFF',
    },
  };

  useEffect(() => {
    if (data && !isEditorInitialized) {
      setMedicationConsult({
        counselSessionId: counselSessionId || '',
        medicationCounselId: data.medicationCounselId || '',
        counselRecord: data.counselRecord || '',
        counselRecordHighlights: data.counselRecordHighlights || [],
      });

      const currentText = editorState.getCurrentContent().getPlainText();
      if (!currentText) {
        const contentState = ContentState.createFromText(
          data.counselRecord || '',
        );

        let contentStateWithHighlight = contentState;

        if (data.counselRecordHighlights?.length && data.counselRecord) {
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
                const selectionState = SelectionState.createEmpty(
                  blockKey,
                ).merge({
                  anchorOffset: targetStart,
                  focusOffset: targetEnd,
                  hasFocus: true,
                });

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
        setEditorInitialized(true);
      }
    }
  }, [
    data,
    setEditorState,
    setMedicationConsult,
    counselSessionId,
    editorState,
    isEditorInitialized,
    setEditorInitialized,
  ]);

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

      if (startIndex !== -1) {
        highlights.push({
          startIndex,
          endIndex: totalOffset + text.length,
          highlight: currentHighlight,
        });
      }

      totalOffset += text.length + 1;
    });

    return highlights;
  }, [editorState]);

  useEffect(() => {
    setCounselRecordHighlights(getHighlightedText() || []);
  }, [setCounselRecordHighlights, getHighlightedText]);

  return (
    <div
      className={cn(
        'rounded-lg border border-grayscale-30 bg-white p-0',
        className,
      )}>
      <div
        className="h-[550px] border-b border-grayscale-30 p-2"
        onClick={() => getHighlightedText()}>
        <Editor
          editorState={editorState}
          placeholder={`실시간으로 상담 내용을 기록하세요.
형광펜 하이라이트 시, 다음 상담에 해당 내용을 가장 먼저 확인할 수 있어요.`}
          onChange={(editorState) => {
            setEditorState(editorState);
            setCounselRecord(editorState.getCurrentContent().getPlainText());
          }}
          customStyleMap={styleMap}
        />
      </div>
      <div className="flex items-center">
        <img
          className="m-2 inline-block h-8 w-8 cursor-pointer"
          src={isHoverHighlightButton ? highlightpenBlue : highlightpenBlack}
          alt="하이라이트"
          onClick={applyHighlight}
          onMouseEnter={() => setIsHoverHighlightButton(true)}
          onMouseLeave={() => setIsHoverHighlightButton(false)}
        />
        <img
          className="inline-block h-8 w-8 cursor-pointer"
          src={isHoverEraserButton ? eraserBlue : eraserBlack}
          alt="하이라이트 지우기"
          onClick={removeHighlight}
          onMouseEnter={() => setIsHoverEraserButton(true)}
          onMouseLeave={() => setIsHoverEraserButton(false)}
        />
        <Tooltip
          className="ml-3"
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
