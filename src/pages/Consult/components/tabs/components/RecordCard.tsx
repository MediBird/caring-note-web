import ReactMarkdown from 'react-markdown';

interface RecordCardProps {
  title: string;
  content?: string | object;
  emptyMessage: string;
}

const RecordCard = ({ title, content, emptyMessage }: RecordCardProps) => {
  const formatContent = (content: string | object) => {
    if (typeof content === 'string') {
      return content;
    }
    return JSON.stringify(content, null, 2);
  };

  return (
    <div className="flex h-[35rem] flex-1 flex-col overflow-hidden rounded-lg bg-white">
      <div className="flex h-[3.375rem] items-center bg-primary-20 px-4">
        <h3 className="text-body1 font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {content ? (
          <ReactMarkdown
            className="prose prose-sm prose-gray max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700"
            components={{
              p: ({ children }) => (
                <p className="mb-3 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-3 ml-4 list-disc">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-3 ml-4 list-decimal">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              h1: ({ children }) => (
                <h1 className="mb-3 text-lg font-bold">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="mb-2 text-base font-bold">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-2 text-sm font-bold">{children}</h3>
              ),
            }}>
            {formatContent(content)}
          </ReactMarkdown>
        ) : (
          <div className="text-grayscale-60">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
};

export default RecordCard;
