import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import React, { useEffect, useState } from 'react';

interface SearchComponentProps {
  commandProps?: React.ComponentProps<typeof Command>;
  placeholder?: string;
  items?: string[];
  onSelect?: (item: string) => void;
  onChangeInputValue?: (value: string) => void;
  defaultInputValue?: string;
  searchIcon?: React.ReactNode; // 돋보기 아이콘 추가
  onFocus?: () => void; // onFocus 이벤트 추가
  onBlur?: () => void; // onBlur 이벤트 추가
}

const SearchComponent = ({
  commandProps,
  placeholder = 'Type a command or search...',
  items = [],
  onSelect,
  onChangeInputValue,
  defaultInputValue = '',
  searchIcon,
  onFocus, // onFocus 받기
  onBlur, // onBlur 받기
}: SearchComponentProps) => {
  const [inputValue, setInputValue] = useState(defaultInputValue);
  const [filteredItems, setFilteredItems] = useState(items); // 필터링된 items 상태 추가
  const [isFocused, setIsFocused] = useState(false); // 포커스 상태 추가

  useEffect(() => {
    // items가 변경될 때 filteredItems 업데이트
    setFilteredItems(items);
  }, [items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (onChangeInputValue) onChangeInputValue(value);
    if (value === '') {
      setFilteredItems([]);
    } else {
      // 입력 값에 따라 items를 필터링
      const updatedItems = items.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredItems(updatedItems);
    }
  };

  const handleSelect = (item: string) => {
    setInputValue(item);
    if (onSelect) onSelect(item);
  };

  return (
    <div className="relative h-full w-full bg-transparent">
      <Command
        className="rounded-lg"
        {...commandProps}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // e.preventDefault(); // 기본 동작 방지하면 안됨 (기본 동작이 select)
            if (inputValue) {
              // inputValue가 존재한다는 뜻은, Suggestions에 있는 item을 선택하지 않았다는 뜻
              handleSelect(inputValue);
            }
          }
        }}>
        {/* 돋보기 아이콘 추가 */}
        <div className="relative">
          {searchIcon && (
            <div className="-translate-y-1/12 absolute left-3 top-2 transform">
              {typeof searchIcon === 'string' && <img src={searchIcon} />}
            </div>
          )}
        </div>
        <CommandInput
          className={`h-full w-full ${searchIcon ? 'pl-8' : ''}`}
          placeholder={placeholder}
          value={inputValue}
          onFocus={() => {
            setIsFocused(true);
            if (onFocus) onFocus();
          }}
          onBlur={() => {
            setIsFocused(false);
            if (onBlur) onBlur();
          }}
          onChangeCapture={handleInputChange}
          autoFocus
        />

        <CommandList className="absolute left-0 top-12 z-10 max-h-48 w-full overflow-auto rounded border bg-white shadow-lg">
          <CommandGroup>
            {isFocused && (
              <CommandItem className="p-2 text-left text-sm">
                검색 결과가 없습니다.
              </CommandItem>
            )}
            {inputValue !== '' &&
              filteredItems?.map((item, index) => {
                return (
                  <CommandItem key={index} onSelect={() => handleSelect(item)}>
                    {item}
                  </CommandItem>
                );
              })}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default SearchComponent;
