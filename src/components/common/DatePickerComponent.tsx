import React, { useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

interface DatePickerComponentProps {
  placeholder?: string; // Placeholder를 동적으로 받을 수 있도록 설정
  useRange?: boolean; // 범위 선택 여부
  asSingle?: boolean; // 단일 선택 여부
  displayFormat?: string; // 날짜 표시 포맷
  readOnly?: boolean;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  placeholder = "날짜를 선택하세요", // 기본 Placeholder
  useRange = false, // 기본값: 단일 날짜 선택
  asSingle = true, // 기본값: 단일 날짜 선택 UI
  displayFormat = "YYYY년 MM월 DD일", // 기본 날짜 표시 포맷
  readOnly = false,
}) => {
  const [value, setValue] = useState<DateValueType>({
    startDate: new Date(),
    endDate: null,
  });

  const handleValueChange = (newValue: DateValueType) => {
    setValue(newValue);
  };
  return (
    <Datepicker
      value={value}
      primaryColor={"blue"}
      i18n={"ko"}
      onChange={handleValueChange}
      useRange={useRange}
      asSingle={asSingle}
      readOnly={readOnly}
      displayFormat={displayFormat}
      placeholder={placeholder} // Placeholder를 props로 전달
      inputClassName="w-full rounded-md focus:ring-0 font-medium bg-white focus:border-grayscale-5 placeholder:text-grayscale-40 text-grayscale-80 dark:bg-blue-900 dark:placeholder:text-blue-100"
      popoverDirection="down"
      toggleClassName="absolute text-grayscale-80 right-0 h-full px-3 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
    />
  );
};

export default DatePickerComponent;
