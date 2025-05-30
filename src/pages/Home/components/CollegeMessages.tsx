import { SocialProofTestimonials } from '@/components/magicui/testimonial';

function CollegeMessages() {
  const originalMessages = [
    {
      name: '약사 C님',
      role: '',
      description: (
        <div className="text-center leading-6">
          약대 입학 후 얼마 안 되었을 때, 더 나은 사회를 위해 같이 공부하고
          행동해 보자는 글귀를 읽고 가입하기로 마음먹었어요.
        </div>
      ),
    },
    {
      name: '약사 P님',
      role: '',
      description: (
        <div className="text-center leading-6">
          사람은 누구나 혼자 살아갈 수는 없잖아요? 늘픔은 느슨하지만 연결되어
          있다는 안정감을 주는 울타리 같은 존재예요.
        </div>
      ),
    },
    {
      name: '약사 C님',
      role: '',
      description: (
        <div className="text-center leading-6">
          세상에는 서글픈 일도, 잔인한 일도 많죠. 그런 것들을 조금이라도 바꿀 수
          있다면 삶의 마지막에서 만족스럽게 느낄 것 같아요.
        </div>
      ),
    },
    {
      name: '약사 C님',
      role: '',
      description: (
        <div className="text-center leading-6">
          당신에게 따뜻하고, 세상에 이로운이라는 늘픔 약국의 슬로건처럼 저 역시
          그런 사람이 되고 싶습니다.
        </div>
      ),
    },
    {
      name: '약사 L님',
      role: '',
      description: (
        <div className="text-center leading-6">
          늘픔에서 어떻게 살 것인가, 어떤 약사가 될 것인가라는 질문에 치열하게
          고민하고 토론할 수 있었어요.
        </div>
      ),
    },
    {
      name: '약사 K님',
      role: '',
      description: (
        <div className="text-center leading-6">
          늘픔은 저를 단순히 똑똑한 사람이 아니라, 사회적으로도 사람다운 사람이
          되게 만들어줘요.
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl border-white bg-white shadow-container">
      <div className="p-4 pb-0">
        <h1 className="w-full break-keep text-left text-xl font-bold leading-[26px] text-primary-50">
          동료약사의 따뜻한 마음 ✨
        </h1>
      </div>

      {/* 작은 화면: 수평 스크롤 */}
      <div className="block md:hidden">
        <SocialProofTestimonials
          title=""
          testimonials={originalMessages}
          maxHeight="340px"
          columns={1}
          vertical={true}
          className="[&_.container]:mx-0 [&_.container]:max-w-none [&_.container]:px-1 [&_section]:py-0"
        />
      </div>

      {/* 중간 화면: 수직 스크롤 */}
      <div className="hidden md:block xl:hidden">
        <SocialProofTestimonials
          title=""
          testimonials={originalMessages}
          maxHeight="200px"
          columns={2}
          vertical={true}
          className="[&_.container]:mx-0 [&_.container]:max-w-none [&_.container]:px-1 [&_section]:py-0"
        />
      </div>

      {/* 큰 화면: 수평 스크롤 */}
      <div className="hidden xl:block">
        <SocialProofTestimonials
          title=""
          testimonials={originalMessages}
          maxHeight="340px"
          columns={1}
          vertical={true}
          className="[&_.container]:mx-0 [&_.container]:max-w-none [&_.container]:px-1 [&_section]:py-0"
        />
      </div>
    </div>
  );
}

export default CollegeMessages;
