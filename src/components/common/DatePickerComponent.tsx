import { ko } from "date-fns/locale"; // 한국어 로케일
import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ko", ko);

const DatePickerComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
  }: {
    date: Date;
    decreaseMonth: () => void;
    increaseMonth: () => void;
  }) => (
    <div className="flex justify-between items-center px-4 py-2">
      <span className="text-black font-bold">
        {date.getFullYear()}년 {date.getMonth() + 1}월
      </span>
      <button
        onClick={decreaseMonth}
        className="text-gray-500 hover:text-blue-500 focus:outline-none">
        {"<"}
      </button>
      <button
        onClick={increaseMonth}
        className=" text-gray-500 hover:text-blue-500 focus:outline-none">
        {">"}
      </button>
    </div>
  );

  const dayClassName = (date: Date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "border-primary-60 text-body2 text-grayscale-80 font-medium rounded-full"; // 오늘 날짜 스타일
    }
    if (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    ) {
      return "bg-primary-50 rounded-full text-white text-body2 font-medium";
    }
    return "hover:bg-grayscale-5";
  };

  const onChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        날짜 선택
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="yyyy년 MM월 dd일"
        locale="ko"
        renderCustomHeader={renderCustomHeader}
        dayClassName={dayClassName}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        popperClassName="shadow-lg rounded-md"
      />
    </div>
  );
};

export default DatePickerComponent;
