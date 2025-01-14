interface CollegeMessageProps {
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CollegeMessage({ message }: CollegeMessageProps) {
  return (
    <div className="flex flex-row 2xl:flex-col w-full bg-white border-white rounded-xl bg-opacity-60 pt-6 pb-3 gap-3 px-4 items-center justify-between shadow-container">
      <h1 className="text-left text-xl font-bold break-keep text-primary-50 w-[168px] 2xl:w-full">
        동료약사의 <br className="2xl:hidden" />
        따듯한 마음
      </h1>
      <div className="flex flex-col p-3 bg-primary-5 rounded-[8px] xl:h-[120px] items-center justify-center">
        <div className="text-center p-3 ">
          {
            '약대 입학 후 얼마 안 되었을 때, 더 나은 사회를 위해 같이 공부하고 행동해 보자는 글귀를 읽고 가입하기로 마음먹었어요.'
          }
        </div>
      </div>
    </div>
  );
}

export default CollegeMessage;
