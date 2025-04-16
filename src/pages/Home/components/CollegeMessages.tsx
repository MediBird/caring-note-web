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
    <div className="flex flex-col items-center justify-start gap-3 rounded-xl border-white bg-white p-4 shadow-container">
      <h1 className="w-full break-keep text-left text-xl font-bold leading-[26px] text-primary-50">
        동료약사의 따뜻한 마음 ✨
      </h1>
      <div className="flex w-full flex-row gap-3 hd:flex-col">
        <div className="flex w-full flex-col items-center justify-center gap-[10px] rounded-[8px] bg-primary-5 p-3">
          <div className="text-center leading-6">{messages[0].message}</div>
          <p className="text-grayscale-50">{`- ${messages[0].name} -`}</p>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-[10px] rounded-[8px] bg-primary-5 p-3">
          <div className="text-center leading-6">{messages[1].message}</div>
          <p className="text-grayscale-50">{`- ${messages[1].name} -`}</p>
        </div>
      </div>
    </div>
  );
}

export default CollegeMessages;
