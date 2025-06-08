import ReactMarkdown from 'react-markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { EDITOR_THEME } from '@/pages/Consult/constants/EditorTheme';
import { safeEditorContentParser } from '@/utils/safeEditorContentParser';

interface RecordCardProps {
  title: string;
  content?: string | object;
  emptyMessage: string;
  isLexical?: boolean; // Lexical 렌더러 사용 여부
}

const LexicalReadOnlyRenderer = ({ content }: { content: string }) => {
  const initialConfig = {
    namespace: 'ReadOnlyRenderer',
    theme: EDITOR_THEME,
    editable: false,
    onError: (error: Error) => {
      console.error('Lexical read-only error:', error);
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
    editorState: safeEditorContentParser(content),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="prose prose-sm prose-gray max-w-none">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="outline-none"
              style={{
                lineHeight: '1.5',
                fontSize: '16px',
                caretColor: 'black',
              }}
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
};

const RecordCard = ({
  title,
  content,
  emptyMessage,
  isLexical = false,
}: RecordCardProps) => {
  const formatContent = (content: string | object) => {
    if (typeof content === 'string') {
      return content;
    }
    return JSON.stringify(content, null, 2);
  };

  const renderContent = () => {
    if (!content) {
      return <div className="text-grayscale-60">{emptyMessage}</div>;
    }

    const formattedContent = formatContent(content);

    // isLexical prop에 따라 렌더러 선택
    if (isLexical && typeof content === 'string') {
      return <LexicalReadOnlyRenderer content={formattedContent} />;
    }

    // 기본적으로 ReactMarkdown 사용
    return (
      <ReactMarkdown className="prose prose-sm prose-gray max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700">
        {formattedContent}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex h-[35rem] flex-1 flex-col overflow-hidden rounded-lg bg-white">
      <div className="flex h-[3.375rem] items-center bg-primary-20 px-4">
        <h3 className="text-body1 font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
    </div>
  );
};

export default RecordCard;
