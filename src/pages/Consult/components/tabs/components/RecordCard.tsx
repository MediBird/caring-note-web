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
          <ReactMarkdown className="prose prose-sm prose-gray max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700">
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
