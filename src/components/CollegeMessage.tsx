interface CollegeMessageProps {
  message: string;
}

function CollegeMessage({ message }: CollegeMessageProps) {
  return (
    <div className="flex flex-row 2xl:flex-col w-full bg-white border-white rounded-xl bg-opacity-60 pt-6 pb-3 gap-3 px-4 items-center justify-between shadow-container">
      <h1 className="text-left text-xl font-bold break-keep text-primary-50 w-[168px] 2xl:w-full">
        동료약사의 <br className="2xl:hidden" />
        따뜻한 마음
      </h1>
      <div className="flex flex-col p-3 bg-primary-5 rounded-[8px] xl:h-[120px] items-center justify-center">
        <div className="text-center p-3 ">
          {
            message
          }
        </div>
      </div>
    </div>
  );
}

export default CollegeMessage;
