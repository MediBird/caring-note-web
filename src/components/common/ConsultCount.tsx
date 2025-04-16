interface ConsultCountProps {
  messageCount: string;
  patientCount: string;
  date: string;
}

function ConsultCount({ messageCount, patientCount, date }: ConsultCountProps) {
  return (
    <div className="flex w-full flex-row gap-3 rounded-xl bg-white bg-opacity-60 px-4 py-3 shadow-container 2xl:flex-col">
      <div className="p-3">
        <h1 className="w-[168px] break-keep text-xl font-bold text-secondary-50">
          약으로 이어지는 <br className="2xl:hidden" />
          건강한 변화들
        </h1>
        <p className="pt-[10px] text-xs text-grayscale-40">{date} 기준</p>
      </div>
      <div className="hidden gap-1 rounded-[8px] bg-secondary-5 p-3 2xl:flex 2xl:flex-col">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-row items-center justify-between">
            <p className="">복약상담소 방문자</p>
            <p className="font-bold text-secondary-50">{messageCount}</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="">케어링 메세지 연계</p>
            <p className="font-bold text-secondary-50">{patientCount}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row gap-3 2xl:hidden">
        <div className="flex w-full flex-col items-start justify-center gap-2 rounded-md bg-secondary-5 px-5 py-4">
          <p className="">복약상담소 방문자</p>
          <p className="font-bold text-secondary-50">{messageCount}명</p>
        </div>
        <div className="flex w-full flex-col items-start justify-center gap-2 rounded-md bg-secondary-5 px-5 py-4">
          <p className="">케어링 메세지 연계</p>
          <p className="font-bold text-secondary-50">{patientCount}회</p>
        </div>
      </div>
    </div>
  );
}

export default ConsultCount;
