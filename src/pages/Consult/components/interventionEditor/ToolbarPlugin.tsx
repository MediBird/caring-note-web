import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';

import { useCallback, useEffect, useState } from 'react';
import H1Icon from '@/assets/icon/24/format.h1.svg?react';
import BoldIcon from '@/assets/icon/24/format.bold.svg?react';
import HighlightIcon from '@/assets/icon/24/format.highlight.svg?react';
import BulletListIcon from '@/assets/icon/24/format.bulletlist.svg?react';
import NumberListIcon from '@/assets/icon/24/format.numberedlist.svg?react';

// 이벤트 타입 정의
const eventTypes = {
  formatHeading: 'formatHeading',
  formatBold: 'formatBold',
  formatHighlight: 'formatHighlight',
  formatBulletList: 'formatBulletList',
  formatNumberList: 'formatNumberList',
} as const;

// 이벤트 타입을 유니온 타입으로 정의
type EventType = (typeof eventTypes)[keyof typeof eventTypes];

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<string>('paragraph');
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    const activeEvents: EventType[] = [];

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();

      if (selection.hasFormat('bold')) {
        activeEvents.push(eventTypes.formatBold);
      }

      if (selection.hasFormat('highlight')) {
        activeEvents.push(eventTypes.formatHighlight);
      }

      try {
        const topLevelElement = anchorNode.getTopLevelElementOrThrow();

        if (
          $isHeadingNode(topLevelElement) &&
          topLevelElement.getTag() === 'h1'
        ) {
          activeEvents.push(eventTypes.formatHeading);
          setBlockType('h1');
        } else if ($isListNode(topLevelElement)) {
          const listType = (topLevelElement as ListNode).getTag();
          setBlockType(listType);

          if (listType === 'ul') {
            activeEvents.push(eventTypes.formatBulletList);
          } else if (listType === 'ol') {
            activeEvents.push(eventTypes.formatNumberList);
          }
        } else {
          setBlockType('paragraph');
        }
      } catch (error) {
        console.error('Error checking node type:', error);
        setBlockType('paragraph');
      }

      setSelectedEventTypes(activeEvents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const isEventActive = (eventType: EventType) => {
    return selectedEventTypes.includes(eventType);
  };

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  const formatHeading = () => {
    const newIsHeading = blockType !== 'h1';
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (newIsHeading) {
          $setBlocksType(selection, () => $createHeadingNode('h1'));
        } else {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      }
    });
    setBlockType(newIsHeading ? 'h1' : 'paragraph');
    const updatedEvents = toggleEventType(
      eventTypes.formatHeading,
      newIsHeading,
      selectedEventTypes,
    );
    setSelectedEventTypes(updatedEvents);
  };

  const formatBold = () => {
    const newIsBold = !isEventActive(eventTypes.formatBold);
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    setSelectedEventTypes(
      toggleEventType(eventTypes.formatBold, newIsBold, selectedEventTypes),
    );
  };

  const formatHighlight = () => {
    const newIsHighlight = !isEventActive(eventTypes.formatHighlight);
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight');
    setSelectedEventTypes(
      toggleEventType(
        eventTypes.formatHighlight,
        newIsHighlight,
        selectedEventTypes,
      ),
    );
  };

  const formatBulletList = () => {
    const newIsBulletList = !isEventActive(eventTypes.formatBulletList);

    if (newIsBulletList) {
      // 불릿 리스트 활성화
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // 선택 영역의 블록을 단락으로 변환
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });

      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }

    const updatedEvents = [...selectedEventTypes];
    if (newIsBulletList) {
      if (!updatedEvents.includes(eventTypes.formatBulletList)) {
        updatedEvents.push(eventTypes.formatBulletList);
      }

      const numberIndex = updatedEvents.indexOf(eventTypes.formatNumberList);
      if (numberIndex !== -1) {
        updatedEvents.splice(numberIndex, 1);
      }

      setBlockType('ul');
    } else {
      const index = updatedEvents.indexOf(eventTypes.formatBulletList);
      if (index !== -1) {
        updatedEvents.splice(index, 1);
      }

      setBlockType('paragraph');
    }

    setSelectedEventTypes(updatedEvents);
  };

  const formatNumberList = () => {
    const newIsNumberList = !isEventActive(eventTypes.formatNumberList);

    if (newIsNumberList) {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });

      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }

    const updatedEvents = [...selectedEventTypes];

    if (newIsNumberList) {
      if (!updatedEvents.includes(eventTypes.formatNumberList)) {
        updatedEvents.push(eventTypes.formatNumberList);
      }

      const bulletIndex = updatedEvents.indexOf(eventTypes.formatBulletList);
      if (bulletIndex !== -1) {
        updatedEvents.splice(bulletIndex, 1);
      }

      setBlockType('ol');
    } else {
      const index = updatedEvents.indexOf(eventTypes.formatNumberList);
      if (index !== -1) {
        updatedEvents.splice(index, 1);
      }

      setBlockType('paragraph');
    }

    setSelectedEventTypes(updatedEvents);
  };

  const toggleEventType = (
    eventType: EventType,
    isActive: boolean,
    currentEvents: EventType[],
  ): EventType[] => {
    const updatedEvents = [...currentEvents];

    if (isActive) {
      if (!updatedEvents.includes(eventType)) {
        updatedEvents.push(eventType);
      }
    } else {
      const index = updatedEvents.indexOf(eventType);
      if (index !== -1) {
        updatedEvents.splice(index, 1);
      }
    }

    return updatedEvents;
  };

  return (
    <div className="flex gap-2 border-b border-grayscale-20 px-2 py-1">
      <ToolbarButton
        onClick={formatHeading}
        isActive={isEventActive(eventTypes.formatHeading)}
        title="제목 1"
        children={<H1Icon />}
      />
      <ToolbarButton
        onClick={formatBold}
        isActive={isEventActive(eventTypes.formatBold)}
        title="굵게"
        children={<BoldIcon />}
      />
      <ToolbarButton
        onClick={formatHighlight}
        isActive={isEventActive(eventTypes.formatHighlight)}
        title="강조"
        children={<HighlightIcon />}
      />
      <ToolbarButton
        onClick={formatBulletList}
        isActive={isEventActive(eventTypes.formatBulletList)}
        title="불릿 목록"
        children={<BulletListIcon />}
      />
      <ToolbarButton
        onClick={formatNumberList}
        isActive={isEventActive(eventTypes.formatNumberList)}
        title="번호 목록"
        children={<NumberListIcon />}
      />
    </div>
  );
};

export default ToolbarPlugin;

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton = ({
  onClick,
  isActive,
  title,
  children,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`h-6 w-6 rounded-[2px] hover:bg-primary-10 ${
        isActive ? 'bg-primary-10 text-primary-50' : ''
      }`}
      title={title}>
      {children}
    </button>
  );
};
