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
    <div className="relative w-full h-full shadow-cell-shadow rounded-[8px] bg-white content-center px-3">
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
        className="w-full h-7 border-b-2 border-primary-50 rounded-none px-3"
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
      className={`cursor-pointer px-3 w-full h-full flex items-center justify-start ${
        value ? 'text-grayscale-70' : 'text-grayscale-30'
      }`}>
      {value ? value : placeholder}
      {unit ? unit : ''}
    </div>
  );
}

export default TextInputCell;
