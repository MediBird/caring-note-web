import { cn } from '@/lib/utils';
import React from 'react';

// FOR TEST
const tempData = [
  { speaker: 'A', text: '안녕하세요', time: '12:25' },
  { speaker: 'B', text: '선생님 말씀은 뭔지 알겠어요', time: '12:25' },
  {
    speaker: 'A',
    text: '저희가 얘기를 안 해드리면 의사랑 이야기하기가 너무 어렵잖아요. 그래서 그냥 의견을 드리거나 정보를 드리는 거지 판단은 최종적으로 의사가 합니다.',
    time: '12:25',
  },
  {
    speaker: 'A',
    text: '제가 보니까 여기 소화제를 세 개 드시고 계시는데요',
    time: '12:25',
  },
  { speaker: 'B', text: '네네', time: '12:25' },
  {
    speaker: 'E',
    text: '제가 보니까 여기 소화제를 세 개 드시고 계시는데요',
    time: '12:25',
  },
  { speaker: 'B', text: '네네', time: '12:25' },
  {
    speaker: 'E',
    text: '제가 보니까 여기 소화제를 세 개 드시고 계시는데요',
    time: '12:25',
  },
  {
    speaker: 'A',
    text: '제가 보니까 여기 소화제를 세 개 드시고 계시는데요',
    time: '12:25',
  },
  { speaker: 'B', text: '네네', time: '12:25' },
  {
    speaker: 'E',
    text: '제가 보니까 여기 소화제를 세 개 드시고 계시는데요',
    time: '12:25',
  },
  {
    speaker: 'A',
    text: '제가 보니까 여기 소화제를 세 개 드시고 계시는데요',
    time: '12:25',
  },
  { speaker: 'B', text: '네네', time: '12:25' },
  {
    speaker: 'A',
    text: '제가 보니까 여기 소화제를 세 개 드시고 계시는데요',
    time: '12:25',
  },
  { speaker: 'B', text: '네네', time: '12:25' },
  { speaker: 'B', text: '네네', time: '12:25' },
  {
    speaker: 'E',
    text: '제가 보니까 여기 소화제를 세 개 드시고 계시는데요',
    time: '12:25',
  },
  {
    speaker: 'A',
    text: '제가 보니까 여기 소화제를 세 개 드시고 계시는데요',
    time: '12:25',
  },
];

// TODO: 기디에서 색상 정의한 후 수정
const speakerColors = [
  'text-purple-100 bg-purple-10',
  'text-blue-100 bg-blue-10',
  'text-pink-100 bg-pink-10',
  'text-green-100 bg-green-10',
];

const getColorForSpeaker = (speaker: string) => {
  const speakerIndex = [
    ...new Set(tempData.map((data) => data.speaker)),
  ].indexOf(speaker);
  return speakerColors[speakerIndex % speakerColors.length];
};

const TotalRecordings: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 px-3 py-4 mt-2 max-h-[600px] border-[1px] border-grayscale-30 rounded-[4px] overflow-y-auto ">
      {tempData.map((data, index) => (
        <div key={index} className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <div
              className={cn(
                'flex items-center justify-center text-sm font-medium min-w-[24px] min-h-[24px] rounded-full',
                getColorForSpeaker(data.speaker),
              )}>
              {data.speaker}
            </div>
            <p className="text-body1 text-grayscale-90">{data.text}</p>
          </div>
          <p className="text-body2 text-grayscale-30 ml-2">{data.time}</p>
        </div>
      ))}
    </div>
  );
};

export default TotalRecordings;
