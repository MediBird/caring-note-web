import { useCallback, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { EditorState } from 'lexical';
import FloatingTextFormatToolbarPlugin from '@/pages/Consult/components/interventionEditor/plugins/FloaingTextFormatPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

const theme = {
  heading: {
    h1: 'mb-2 font-medium text-2xl',
  },
  list: {
    ul: 'list-disc pl-5 mb-2',
    ol: 'list-decimal pl-5 mb-2',
  },
  text: {
    bold: 'font-bold',
    highlight: 'bg-[#FFFBB2]',
  },
};

const initialConfig = {
  namespace: 'InterventionEditor',
  theme,
  onError: (error: Error) => {
    console.error(error);
  },
  nodes: [
    HorizontalRuleNode,
    CodeNode,
    HeadingNode,
    LinkNode,
    ListNode,
    ListItemNode,
    QuoteNode,
  ],
};

interface LexicalEditorProps {
  onChange?: (editorState: string) => void;
  initialContent?: string | null;
}

const LexicalEditor = ({ onChange, initialContent }: LexicalEditorProps) => {
  const [editorState, setEditorState] = useState<string | null>(
    initialContent || null,
  );

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const jsonString = JSON.stringify(editorState.toJSON());
        setEditorState(jsonString);
        if (onChange) {
          onChange(jsonString);
        }
      });
    },
    [onChange],
  );

  console.log(editorState);

  return (
    <LexicalComposer
      initialConfig={{
        ...initialConfig,
        editorState: editorState,
      }}>
      <div className="editor-container flex h-full flex-col overflow-hidden rounded-md border border-grayscale-10">
        <ToolbarPlugin />
        <div className="relative flex-1 overflow-hidden p-2">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="absolute inset-0 max-w-none overflow-y-auto p-2 leading-normal outline-none"
                style={{
                  caretColor: 'black',
                  lineHeight: '1.5',
                  fontSize: '16px',
                }}
              />
            }
            placeholder={
              <div className="pointer-events-none absolute left-2 top-2 text-grayscale-40">
                상담 내용을 작성해 주세요.
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ListPlugin />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleChange} />
          <FloatingTextFormatToolbarPlugin />
          <MarkdownShortcutPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;
