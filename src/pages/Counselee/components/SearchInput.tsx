import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
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

    const handleClear = () => {
      setLocalValue('');
      onChange('');
      onSearch();
    };

    return (
      <div className="relative">
        <button
          type="button"
          onClick={handleSearch}
          className="absolute inset-y-0 left-3 flex items-center w-10">
          <Search className="h-5 w-5" />
        </button>
        <Input
          ref={inputRef}
          value={localValue}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="내담자 검색..."
          className="pl-10 pr-10"
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center">
            <X className="h-5 w-5" />
          </button>
        )}
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
