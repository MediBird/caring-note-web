import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

type TimeOption = {
  value: string;
  label: string;
};

const generateTimeOptions = (): TimeOption[] => {
  const options: TimeOption[] = [];
  for (let i = 0; i < 24; i++) {
    options.push({ value: `${i}:00`, label: `${i}:00` });
    options.push({ value: `${i}:30`, label: `${i}:30` });
  }
  return options;
};

const timeOptions = generateTimeOptions();

const TimePickerComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<TimeOption | null>(null);
  const [endTime, setEndTime] = useState<TimeOption | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleStartTimeChange = (option: TimeOption | null) => {
    setStartTime(option);
  };

  const handleEndTimeChange = (option: TimeOption | null) => {
    setEndTime(option);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Date Picker */}
      <div className="w-full max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          날짜 선택
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy년 MM월 dd일"
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Time Picker */}
      <div className="flex items-center space-x-4 w-full max-w-lg">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시작 시간
          </label>
          <Select
            options={timeOptions}
            placeholder="시작 시간"
            value={startTime}
            onChange={handleStartTimeChange}
            classNamePrefix="time-select"
          />
        </div>

        <span className="text-gray-500">~</span>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            종료 시간
          </label>
          <Select
            options={timeOptions}
            placeholder="종료 시간"
            value={endTime}
            onChange={handleEndTimeChange}
            classNamePrefix="time-select"
          />
        </div>
      </div>
    </div>
  );
};

export default TimePickerComponent;
