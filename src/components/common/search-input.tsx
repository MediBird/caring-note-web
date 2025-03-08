import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useRef } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
      <Input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        placeholder="내담자 검색"
        className="pl-10 pr-10"
      />
      {value && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
