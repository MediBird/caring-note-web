interface DialogProps {
  title: string;
  content: string;
  onCancel: () => void;
  onDelete: () => void;
  isOpen: boolean;
}
const Dialog = ({
  title,
  content,
  onCancel,
  onDelete,
  isOpen,
}: DialogProps) => {
  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-80 p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onCancel}
            aria-label="Close">
            ✕
          </button>
        </div>
        <div className="mt-3">
          <p className="text-gray-700">{content}</p>
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-md text-blue-600 border-blue-600 hover:bg-blue-50">
            취소
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            삭제하기
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
export default Dialog;
