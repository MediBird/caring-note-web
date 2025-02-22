import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { memo, useState, useEffect } from 'react';
import { useRef } from 'react';

export interface SearchInputHandle {
  focus: () => void;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchInput = memo(
  ({ value, onChange, onSearch }: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
    };

    const handleSearch = () => {
      onChange(localValue);
      onSearch();
    };

    return (
      <div className="relative">
        <button
          type="button"
          onClick={handleSearch}
          className="absolute h-full w-10 left-3">
          <Search className="h-5 w-5" />
        </button>
        <Input
          ref={inputRef}
          value={localValue}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="내담자 검색..."
          className="pl-10"
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.onChange === nextProps.onChange &&
      prevProps.onSearch === nextProps.onSearch &&
      prevProps.value === nextProps.value
    );
  },
);
