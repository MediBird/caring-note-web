interface ConsultCountProps {
  messageCount: string;
  patientCount: string;
  date: string;
}

function ConsultCount({ messageCount, patientCount, date }: ConsultCountProps) {
  return (
    <div className="flex flex-row 2xl:flex-col w-full bg-white rounded-xl bg-opacity-60 px-4 py-3 gap-3 shadow-container">
      <div className="p-3">
        <h1 className="w-[168px] text-xl font-bold break-keep text-secondary-50">
          약으로 이어지는 <br className="2xl:hidden" />
          건강한 변화들
        </h1>
        <p className="text-xs text-grayscale-40 pt-[10px]">{date} 기준</p>
      </div>
      <div className="hidden 2xl:flex 2xl:flex-col p-3 bg-secondary-5 rounded-[8px] gap-1">
        <div className="flex flex-col w-full h-full ">
          <div className="flex flex-row items-center justify-between">
            <p className="">복약상담소 방문자</p>
            <p className="font-bold text-secondary-50">{messageCount}</p>
          </div>
          <div className=" flex flex-row items-center justify-between">
            <p className="">케어링 메세지 연계</p>
            <p className="font-bold text-secondary-50">{patientCount}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row 2xl:hidden gap-3 w-full">
        <div className="flex flex-col items-start justify-center bg-secondary-5 w-full px-5 py-4 rounded-md gap-2">
          <p className="">복약상담소 방문자</p>
          <p className="font-bold text-secondary-50">{messageCount}명</p>
        </div>
        <div className="w-full flex flex-col items-start justify-center  bg-secondary-5 px-5 py-4 rounded-md gap-2">
          <p className="">케어링 메세지 연계</p>
          <p className="font-bold text-secondary-50">{patientCount}회</p>
        </div>
      </div>
    </div>
  );
}

export default ConsultCount;
