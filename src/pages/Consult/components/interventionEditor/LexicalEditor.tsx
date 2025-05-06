import { useCallback, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from './ToolbarPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { EditorState } from 'lexical';
import FloatingTextFormatToolbarPlugin from '@/pages/Consult/components/interventionEditor/FloaingTextFormatPlugin';

const theme = {
  heading: {
    h1: 'text-2xl mb-2 font-normal',
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
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
};

interface LexicalEditorProps {
  onChange?: (editorState: string) => void;
  initialContent?: string;
}

const LexicalEditor = ({ onChange, initialContent }: LexicalEditorProps) => {
  const [editorState, setEditorState] = useState<string>(initialContent || '');

  console.log('editorState', editorState);

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

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container h-full overflow-hidden rounded-md border border-grayscale-20">
        <ToolbarPlugin />
        <div className="relative p-2">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[470px] max-w-none leading-normal outline-none"
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
        </div>
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;
