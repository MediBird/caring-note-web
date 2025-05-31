import { useEffect, useState } from 'react';

// 메시지 데이터 상수 - 줄바꿈을 명시적으로 정의
const COLLEGE_MESSAGES = [
  {
    name: '약사 C님',
    message:
      '약대 입학 후 얼마 안 되었을 때, 더 나은\n사회를 위해 같이 공부하고 행동해 보자는\n글귀를 읽고 가입하기로 마음먹었어요.',
  },
  {
    name: '약사 P님',
    message:
      '사람은 누구나 혼자 살아갈 수는 없잖아요?\n늘픔은 느슨하지만 연결되어 있다는\n안정감을 주는 울타리 같은 존재예요.',
  },
  {
    name: '약사 C님',
    message:
      '세상에는 서글픈 일도, 잔인한 일도 많죠.\n그런 것들을 조금이라도 바꿀 수 있다면 삶\n의 마지막에서 만족스럽게 느낄 것 같아요.',
  },
  {
    name: '약사 C님',
    message:
      '당신에게 따뜻하고, 세상에 이로운이라는\n늘픔 약국의 슬로건처럼\n저 역시 그런 사람이 되고 싶습니다.',
  },
  {
    name: '약사 L님',
    message:
      '늘픔에서 어떻게 살 것인가,\n어떤 약사가 될 것인가라는 질문에\n치열하게 고민하고 토론할 수 있었어요.',
  },
  {
    name: '약사 K님',
    message:
      '늘픔은 저를 단순히 똑똑한 사람이 아니라,\n사회적으로도 사람다운 사람이\n되게 만들어줘요.',
  },
];

// 메시지 카드 컴포넌트
interface MessageCardProps {
  message: string;
  name: string;
  className?: string;
}

function MessageCard({ message, name, className = '' }: MessageCardProps) {
  // 줄바꿈 문자를 <br />로 변환하여 렌더링
  const formatMessage = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border border-neutral-200 bg-primary-5 dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ${className}`}>
      <div className="flex h-[16.1875rem] flex-1 items-center justify-center">
        <p className="select-none whitespace-pre-line break-keep text-center text-body1 font-normal text-grayscale-80">
          {formatMessage(message)}
        </p>
      </div>
      <div className="h-6 pb-3 text-center">
        <p className="text-body1 font-medium text-grayscale-50">- {name}</p>
      </div>
    </div>
  );
}

// 메시지 그리드 컴포넌트
interface MessageGridProps {
  firstMessage: { name: string; message: string };
  secondMessage: { name: string; message: string };
  isVisible: boolean;
  layout: 'mobile' | 'tablet' | 'desktop';
}

function MessageGrid({
  firstMessage,
  secondMessage,
  isVisible,
  layout,
}: MessageGridProps) {
  const getLayoutClasses = () => {
    switch (layout) {
      case 'mobile':
        return {
          container: 'block px-3 pb-4 md:hidden',
          grid: 'grid grid-cols-1 gap-3',
          card: 'h-[130px] p-3',
        };
      case 'tablet':
        return {
          container: 'hidden px-3 pb-4 md:block hd:hidden',
          grid: 'grid grid-cols-2 gap-3',
          card: 'max-h-[150px] min-h-[106px] p-3',
        };
      case 'desktop':
        return {
          container: 'hidden px-3 pb-4 hd:block',
          grid: 'grid grid-cols-1 gap-3',
          card: 'h-[130px] p-3',
        };
    }
  };

  const classes = getLayoutClasses();

  return (
    <div className={classes.container}>
      <div
        className={`${classes.grid} transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
        <MessageCard
          message={firstMessage.message}
          name={firstMessage.name}
          className={classes.card}
        />
        <MessageCard
          message={secondMessage.message}
          name={secondMessage.name}
          className={classes.card}
        />
      </div>
    </div>
  );
}

function CollegeMessages() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // 페이드 아웃 시작
      setIsVisible(false);

      // 페이드 아웃 완료 후 메시지 변경 및 페이드 인
      setTimeout(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 2) % COLLEGE_MESSAGES.length,
        );
        setIsVisible(true);
      }, 500); // CSS 트랜지션 지속 시간과 일치
    }, 5000); // 5초마다 메시지 변경

    return () => clearInterval(interval);
  }, []);

  // 표시할 메시지의 인덱스 계산
  const firstIndex = currentIndex;
  const secondIndex = (currentIndex + 1) % COLLEGE_MESSAGES.length;

  const firstMessage = COLLEGE_MESSAGES[firstIndex];
  const secondMessage = COLLEGE_MESSAGES[secondIndex];

  return (
    <div className="max-h-[340px] rounded-xl border-white bg-white shadow-container">
      <div className="p-4">
        <h1 className="w-full break-keep text-left text-xl font-bold leading-[26px] text-primary-50">
          동료약사의 따뜻한 마음 ✨
        </h1>
      </div>

      {/* 작은 화면: 2개씩 세로로 표시 */}
      <MessageGrid
        firstMessage={firstMessage}
        secondMessage={secondMessage}
        isVisible={isVisible}
        layout="mobile"
      />

      {/* 중간 화면: 2개씩 가로로 표시 */}
      <MessageGrid
        firstMessage={firstMessage}
        secondMessage={secondMessage}
        isVisible={isVisible}
        layout="tablet"
      />

      {/* 큰 화면: 2개씩 세로로 표시 */}
      <MessageGrid
        firstMessage={firstMessage}
        secondMessage={secondMessage}
        isVisible={isVisible}
        layout="desktop"
      />
    </div>
  );
}

export default CollegeMessages;
