import { useState, useRef, useCallback } from 'react';
import { SearchInputHandle } from '../../components/SearchInput';

export const useSearch = (options: { onSearch: (value: string) => void }) => {
  const [searchInput, setSearchInput] = useState('');
  const searchInputRef = useRef<SearchInputHandle>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleSearch = useCallback(() => {
    options.onSearch(searchInput);
    searchInputRef.current?.focus();
  }, [searchInput, options.onSearch]);

  return {
    searchInput,
    searchInputRef,
    handleSearchChange,
    handleSearch,
  };
};
