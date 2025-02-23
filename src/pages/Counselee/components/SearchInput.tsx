import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchInput = ({
  value,
  onChange,
  onSearch,
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // value가 변경될 때마다 검색 실행
  useEffect(() => {
    onSearch();
  }, [value, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    onSearch();
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
      <Input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder="내담자 검색"
        className="pl-10 pr-10"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
