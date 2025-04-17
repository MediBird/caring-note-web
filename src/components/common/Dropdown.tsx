import check from '@/assets/icon/16/check.outline.blue.svg';
import arrowDropDown from '@/assets/icon/arrowdropdown.svg';
import arrowDropUp from '@/assets/icon/arrowdropup.svg';
import React, { useState } from 'react';
interface DropdownProps {
  options: string[]; // 드롭다운 항목 배열
  placeholder?: string; // 선택 전 기본 텍스트
  onSelect?: (value: string) => void; // 선택 이벤트 핸들러
  disabled?: boolean; // 드롭다운 비활성화 여부
  helpText?: string; // 드롭다운 아래 표시할 도움말 텍스트
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = 'Select',
  onSelect,
  disabled = false,
  helpText = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // 드롭다운 열림 상태
  const [selectedValue, setSelectedValue] = useState<string | null>(null); // 선택된 값
  const [isFocused, setIsFocused] = useState<boolean>(false); // 포커스 상태

  const handleToggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    if (!disabled) {
      setSelectedValue(value);
      setIsOpen(false);
      if (onSelect) onSelect(value);
    }
  };

  const handleFocus = () => {
    if (!disabled) setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      className={`relative w-52 ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}>
      {/* 드롭다운 헤더 */}
      <div
        className={`flex cursor-pointer items-center justify-between rounded-[0.25rem] border px-2 py-[0.375rem] ${
          disabled
            ? 'border-grayscale-20 bg-grayscale-5'
            : isFocused
              ? 'border-2 border-primary-50 bg-white ring-1 ring-primary-50'
              : 'border-grayscale-30 hover:border-grayscale-50'
        }`}
        onClick={handleToggle}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onFocus={handleFocus}
        onBlur={handleBlur}>
        <span
          className={`text-body1 font-medium ${
            disabled
              ? 'text-grayscale-30'
              : selectedValue
                ? 'text-grayscale-90'
                : 'text-grayscale-40'
          } leading-6`}>
          {selectedValue || placeholder}
        </span>
        <img
          src={isOpen ? arrowDropUp : arrowDropDown}
          alt={isOpen ? 'Collapse' : 'Expand'}
          className="h-[1.25rem] w-[1.25rem]"
        />
      </div>

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <ul
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-[0.25rem] border border-gray-300 bg-white p-2 shadow-lg"
          role="listbox"
          tabIndex={-1}>
          {options.map((option, index) => (
            <li
              key={index}
              className={`flex cursor-pointer items-center justify-between rounded-[0.25rem] px-2 py-1 text-body1 font-medium leading-6 text-grayscale-90 hover:bg-grayscale-3 ${
                selectedValue === option ? 'text-primary-50' : ''
              }`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={selectedValue === option}>
              <span>{option}</span>
              {selectedValue === option && (
                <img src={check} alt="Selected" className="h-4 w-4" />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 도움말 텍스트 */}
      {helpText && (
        <p
          className={`pb-[2px] pt-[1px] text-caption1 font-regular ${
            disabled ? 'text-grayscale-40' : 'text-grayscale-70'
          }`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
