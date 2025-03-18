import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';

interface EditableCellTextInputProps<T extends { id: string }> {
  field: string;
  value: string | number;
  row: Row<T>;
  unit?: number | string;
  handleUpdateCell: (id: string, field: string, value: string | number) => void;
  placeholder?: string;
}

function TextInputCell<T extends { id: string }>({
  field,
  value,
  row,
  unit,
  handleUpdateCell,
  placeholder,
}: EditableCellTextInputProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleUpdate = (id: string, field: string, value: string | number) => {
    setInputValue(value);
    handleUpdateCell(id, field, value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    handleUpdate(row.original.id, field, inputValue);
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  return isEditing ? (
    <div className="relative h-full w-full content-center rounded-[8px] bg-white px-3 shadow-cell-shadow">
      <Input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleUpdate(row.original.id, field, inputValue);
          }
        }}
        autoFocus
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="!focus:outline-none !focus:ring-0 !focus:ring-offset-0 h-7 w-full rounded-none border-0 border-b-2 border-b-primary-50 px-0"
      />
      {unit && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
          {unit}
        </span>
      )}
    </div>
  ) : (
    <div
      onClick={handleFocus}
      className={`flex h-full w-full cursor-pointer items-center justify-start px-3 ${
        value ? 'text-grayscale-70' : 'text-grayscale-30'
      }`}>
      {value ? value : placeholder}
      {unit ? unit : ''}
    </div>
  );
}

export default TextInputCell;
