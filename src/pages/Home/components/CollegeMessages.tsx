function CollegeMessages() {
  const messages = [
    {
      message:
        '약대 입학 후 얼마 안 되었을 때, 더 나은 사회를 위해 같이 공부하고 행동해 보자는 글귀를 읽고 가입하기로 마음먹었어요.',
      name: '대학생 K님',
    },
    {
      message:
        '사람은 누구나 혼자 살아갈 수는 없잖아요? 늘픔은 느슨하지만 연결되어 있다는 안정감을 주는 울타리 같은 존재예요.',
      name: '약사 P님',
    },
  ];

  return (
    <div className="flex flex-col bg-white border-white rounded-xl gap-3 p-4 items-center justify-start shadow-container">
      <h1 className="text-left text-xl font-bold break-keep text-primary-50 w-full leading-[26px]">
        동료약사의 <br className="hd:hidden" />
        따뜻한 마음
      </h1>
      <div className="flex flex-col p-3 bg-primary-5 rounded-[8px] items-center justify-center">
        <div className="text-center">{messages[0].message}</div>
        <p className="text-grayscale-50">{`- ${messages[0].name} -`}</p>
      </div>
      <div className="flex flex-col p-3 bg-primary-5 rounded-[8px] items-center justify-center">
        <div className="text-center">{messages[1].message}</div>
        <p className="text-grayscale-50">{`- ${messages[1].name} -`}</p>
      </div>
    </div>
  );
}

export default CollegeMessages;
