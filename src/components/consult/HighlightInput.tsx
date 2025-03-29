import '@/assets/css/DraftJsCss.css';
import eraserBlack from '@/assets/icon/eraserBlack.png';
import eraserBlue from '@/assets/icon/eraserBlue.png';
import highlightpenBlack from '@/assets/icon/highlightpenBlack.png';
import highlightpenBlue from '@/assets/icon/highlightpenBlue.png';
import Tooltip from '@/components/common/Tooltip';
import { cn } from '@/lib/utils';
import { CounselRecordHighlights } from '@/pages/Consult/types/MedicineConsultDTO';
import useCounselRecordEditorStateStore from '@/store/counselRecordEditorStateStore';
import { useMedicineConsultStore } from '@/store/medicineConsultStore';
import { Editor, EditorState, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { useCallback, useEffect, useState } from 'react';

interface HighlightInputProps {
  className?: string;
  inputClassName?: string;
}

const HighlightInput: React.FC<HighlightInputProps> = ({
  className,
  inputClassName,
}) => {
  const { editorState, setEditorState } = useCounselRecordEditorStateStore();
  const { setCounselRecordHighlights, setCounselRecord } =
    useMedicineConsultStore();

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

  const handleKeyCommand = useCallback(
    (command: string, editorState: EditorState) => {
      if (command === 'cut') {
        try {
          const selection = editorState.getSelection();
          if (!selection.isCollapsed()) {
            const content = editorState.getCurrentContent();
            const selectedText = content
              .getBlockForKey(selection.getStartKey())
              .getText()
              .slice(selection.getStartOffset(), selection.getEndOffset());

            navigator.clipboard.writeText(selectedText);

            const newContent = Modifier.replaceText(content, selection, '');

            const newEditorState = EditorState.push(
              editorState,
              newContent,
              'remove-range',
            );

            setEditorState(newEditorState);
            setCounselRecord(newContent.getPlainText());
            return 'handled';
          }
        } catch (error) {
          console.error('Cut operation failed:', error);
        }
      }
      return 'not-handled';
    },
    [setEditorState, setCounselRecord],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'x' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
          const content = editorState.getCurrentContent();
          const selectedText = content
            .getBlockForKey(selection.getStartKey())
            .getText()
            .slice(selection.getStartOffset(), selection.getEndOffset());

          navigator.clipboard.writeText(selectedText);

          const newContent = Modifier.replaceText(content, selection, '');

          const newEditorState = EditorState.push(
            editorState,
            newContent,
            'remove-range',
          );

          setEditorState(newEditorState);
          setCounselRecord(newContent.getPlainText());
        }
      }
    },
    [editorState, setEditorState, setCounselRecord],
  );

  useEffect(() => {
    setCounselRecordHighlights(getHighlightedText() || []);
  }, [setCounselRecordHighlights, getHighlightedText]);

  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-[4px] border border-grayscale-30 bg-white p-0',
        className,
      )}>
      <div
        className={cn(
          'max-h-[560px] flex-1 overflow-y-auto border-b border-grayscale-30 p-2',
          inputClassName,
        )}
        onClick={() => getHighlightedText()}
        onKeyDown={handleKeyDown}>
        <Editor
          editorState={editorState}
          placeholder={`실시간으로 상담 내용을 기록하세요.
형광펜 하이라이트 시, 다음 상담에 해당 내용을 가장 먼저 확인할 수 있어요.`}
          onChange={(editorState) => {
            setEditorState(editorState);
            setCounselRecord(editorState.getCurrentContent().getPlainText());
          }}
          customStyleMap={styleMap}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
      <div className="flex h-[48px] items-center">
        <button
          className="m-2 inline-block h-8 w-8 cursor-pointer"
          onClick={() => {
            applyHighlight();
          }}
          onMouseEnter={() => setIsHoverHighlightButton(true)}
          onMouseLeave={() => setIsHoverHighlightButton(false)}>
          <img
            src={isHoverHighlightButton ? highlightpenBlue : highlightpenBlack}
            alt="하이라이트"
          />
        </button>
        <button
          className="m-2 ml-0 inline-block h-8 w-8 cursor-pointer"
          onClick={removeHighlight}
          onMouseEnter={() => setIsHoverEraserButton(true)}
          onMouseLeave={() => setIsHoverEraserButton(false)}>
          <img
            src={isHoverEraserButton ? eraserBlue : eraserBlack}
            alt="하이라이트 지우기"
          />
        </button>
        <Tooltip
          id="highlight"
          text={`왼쪽 형광펜으로 원하는 내용을 강조하고, 오른쪽 지우개로 다시 지울 수 있어요`}
          eventType="hover"
          key={'highlight'}
          place="right"
        />
      </div>
    </div>
  );
};

export default HighlightInput;
