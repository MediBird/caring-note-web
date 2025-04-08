import Tooltip from '@/components/common/Tooltip';
import { cn } from '@/lib/utils';
import React, { useCallback, useMemo, useState } from 'react';
import { createEditor, Node, Transforms, Text, Descendant } from 'slate';
import {
  Slate,
  withReact,
  Editable,
  RenderPlaceholderProps,
  useSlate,
  RenderLeafProps,
} from 'slate-react';
import Highlightpen from '@/assets/icon/24/highlighter.outlined.svg?react';
import EraseHighlight from '@/assets/icon/24/erase.outlined.svg?react';
import { useMedicationConsultStore } from '@/pages/Consult/hooks/store/useMedicationConsultStore';
import { CustomEditor } from '@/components/consult/slate';

interface HighlightInputProps {
  className?: string;
  inputClassName?: string;
}

const HighlightInput: React.FC<HighlightInputProps> = ({
  className,
  inputClassName,
}) => {
  const [editor] = useState(() => withReact(createEditor()));

  const {
    editorContent,
    setEditorContent,
    medicationConsult,
    setMedicationConsult,
  } = useMedicationConsultStore();

  const initialEditorContent = useMemo(() => {
    if (
      medicationConsult.counselRecord &&
      medicationConsult.counselRecord !== ''
    ) {
      try {
        const parsedEditorContent = JSON.parse(medicationConsult.counselRecord);

        if (Array.isArray(parsedEditorContent)) {
          return parsedEditorContent;
        }

        return [
          {
            type: 'paragraph',
            children: [{ text: medicationConsult.counselRecord }],
          },
        ];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return [
          {
            type: 'paragraph',
            children: [{ text: medicationConsult.counselRecord }],
          },
        ];
      }
    }
    return editorContent;
  }, [medicationConsult.counselRecord, editorContent]);

  const handleEditorChange = (value: Node[]) => {
    setEditorContent(value);
    setMedicationConsult({
      ...medicationConsult,
      counselRecord: JSON.stringify(value),
    });
  };

  const renderPlaceholder = (props: RenderPlaceholderProps) => {
    const { attributes } = props;
    return (
      <div {...attributes} className="text-grayscale-40 !opacity-100">
        <p>실시간으로 상담 내용을 기록하세요.</p>
        <p>
          형광펜 하이라이트 시, 다음 상담에 해당 내용을 가장 먼저 확인할 수
          있어요.
        </p>
      </div>
    );
  };

  const handleHighlightText = (editor: CustomEditor) => {
    Transforms.setNodes(
      editor,
      { bold: true },
      {
        match: (node) => Text.isText(node),
        split: true,
      },
    );

    setMedicationConsult({
      ...medicationConsult,
      counselRecord: JSON.stringify(editorContent),
    });
  };

  const handleRemoveHighlightText = (editor: CustomEditor) => {
    Transforms.setNodes(
      editor,
      { bold: undefined },
      { match: (node) => Text.isText(node), split: true },
    );

    setMedicationConsult({
      ...medicationConsult,
      counselRecord: JSON.stringify(editorContent),
    });
  };

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div
      className={cn(
        'flex max-h-[560px] w-full flex-col rounded-[4px] border border-grayscale-30 bg-white p-0',
        className,
      )}>
      <Slate
        editor={editor}
        initialValue={initialEditorContent as Descendant[]}
        onChange={handleEditorChange}>
        <div
          className={cn(
            'h-full w-full flex-1 overflow-y-auto border-b border-grayscale-30 p-2',
            inputClassName,
          )}>
          <Editable
            className="h-full w-full focus:outline-none"
            placeholder="placeholder"
            renderPlaceholder={renderPlaceholder}
            renderLeaf={renderLeaf}
          />
        </div>
        <div className="flex h-[48px] items-center px-3">
          <HighlightTextButton onClick={handleHighlightText} />
          <EraseHighlightTextButton onClick={handleRemoveHighlightText} />
          <Tooltip
            id="highlight"
            text={`왼쪽 형광펜으로 원하는 내용을 강조하고, 오른쪽 지우개로 다시 지울 수 있어요`}
            eventType="hover"
            key={'highlight'}
            place="right"
          />
        </div>
      </Slate>
    </div>
  );
};

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{
        backgroundColor: props.leaf.bold ? '#FFBD14' : 'transparent',
      }}>
      {props.children}
    </span>
  );
};

const HighlightTextButton = ({
  onClick,
}: {
  onClick: (editor: CustomEditor) => void;
}) => {
  const editor = useSlate();

  return (
    <button
      className="mr-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-grayscale-10 bg-grayscale-3 text-grayscale-80 hover:text-primary-50"
      onClick={() => onClick(editor)}>
      <Highlightpen />
    </button>
  );
};

const EraseHighlightTextButton = ({
  onClick,
}: {
  onClick: (editor: CustomEditor) => void;
}) => {
  const editor = useSlate();

  return (
    <button
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-grayscale-10 bg-grayscale-3 text-grayscale-80 hover:text-primary-50"
      onClick={() => onClick(editor)}>
      <EraseHighlight />
    </button>
  );
};

export default HighlightInput;
