import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
  $getRoot,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import BoldIcon from '@/assets/icon/24/format.bold.svg?react';
import HighlightIcon from '@/assets/icon/24/format.highlight.svg?react';
import { getDOMRangeRect } from '../utils/getDOMRangeRect';
import { getSelectedNode } from '../utils/getSelectNode';
import { setFloatingElemPosition } from '../utils/setFloatingElemPosition';

interface TextFormatFloatingToolbarProps {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isBold: boolean;
  isHighlight: boolean;
  setIsBold: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHighlight: React.Dispatch<React.SetStateAction<boolean>>;
}

function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isBold,
  isHighlight,
  setIsBold,
  setIsHighlight,
}: TextFormatFloatingToolbarProps) {
  const popupCharStylesEditorRef = useRef<HTMLDivElement>(null);

  function mouseMoveListener(e: MouseEvent) {
    if (
      popupCharStylesEditorRef?.current &&
      (e.buttons === 1 || e.buttons === 3)
    ) {
      popupCharStylesEditorRef.current.style.pointerEvents = 'none';
    }
  }

  function mouseUpListener() {
    if (popupCharStylesEditorRef?.current) {
      popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener('mousemove', mouseMoveListener);
      document.addEventListener('mouseup', mouseUpListener);

      return () => {
        document.removeEventListener('mousemove', mouseMoveListener);
        document.removeEventListener('mouseup', mouseUpListener);
      };
    }
  }, [popupCharStylesEditorRef]);

  const updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();
    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      $isRangeSelection(selection) &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const selectedNode = getSelectedNode(selection);

      if (selectedNode) {
        popupCharStylesEditorElem.style.display = 'flex';

        const rangeRect = getDOMRangeRect({
          nativeSelection,
          rootElement,
        });

        if (rangeRect === null) {
          popupCharStylesEditorElem.style.display = 'none';
          return;
        }

        let isFirstNode = false;

        try {
          if (selectedNode.getKey() !== 'root') {
            const topLevelElement = selectedNode.getTopLevelElement();
            if (topLevelElement) {
              const rootNode = $getRoot();
              const firstChild = rootNode.getFirstChild();
              isFirstNode = firstChild ? topLevelElement.is(firstChild) : false;
            }
          }
        } catch (error) {
          console.error('노드 관계 확인 중 오류 발생:', error);
        }

        setFloatingElemPosition({
          targetRect: rangeRect,
          floatingElem: popupCharStylesEditorElem,
          anchorElem,
          isFirstNode,
        });
      } else {
        popupCharStylesEditorElem.style.display = 'none';
      }
    } else {
      popupCharStylesEditorElem.style.display = 'none';
    }
  }, [editor, anchorElem]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [editor, updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateTextFormatFloatingToolbar]);

  return (
    <div
      ref={popupCharStylesEditorRef}
      className="absolute left-0 top-0 z-50 flex gap-2 rounded-md bg-white px-1.5 py-1 shadow-container">
      {editor.isEditable() && (
        <>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              setIsBold(!isBold);
            }}
            className={`h-6 w-6 rounded-[2px] hover:bg-gray-100 ${
              isBold ? 'bg-primary-10 text-primary-50' : ''
            }`}>
            <BoldIcon />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight');
              setIsHighlight(!isHighlight);
            }}
            className={`h-6 w-6 rounded-[2px] hover:bg-gray-100 ${
              isHighlight ? 'bg-primary-10 text-primary-50' : ''
            }`}>
            <HighlightIcon />
          </button>
        </>
      )}
    </div>
  );
}

function useFloatingTextFormatToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
) {
  const [isHighlight, setIsHighlight] = useState(false);
  const [isBold, setIsBold] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      setIsBold(selection.hasFormat('bold'));
      setIsHighlight(selection.hasFormat('highlight'));
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsBold(false);
          setIsHighlight(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isBold={isBold}
      isHighlight={isHighlight}
      setIsBold={setIsBold}
      setIsHighlight={setIsHighlight}
    />,
    anchorElem,
  );
}

export default function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
}) {
  const [editor] = useLexicalComposerContext();

  return useFloatingTextFormatToolbar(editor, anchorElem);
}
