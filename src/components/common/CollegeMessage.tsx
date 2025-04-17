interface CollegeMessageProps {
  message: string;
}

function CollegeMessage({ message }: CollegeMessageProps) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-3 rounded-xl border-white bg-white bg-opacity-60 px-4 pb-3 pt-6 shadow-container 2xl:flex-col">
      <h1 className="w-[168px] break-keep text-left text-xl font-bold text-primary-50 2xl:w-full">
        동료약사의 <br className="2xl:hidden" />
        따뜻한 마음
      </h1>
      <div className="flex flex-col items-center justify-center rounded-[8px] bg-primary-5 p-3 xl:h-[120px]">
        <div className="p-3 text-center">{message}</div>
      </div>
    </div>
  );
}

export default CollegeMessage;
