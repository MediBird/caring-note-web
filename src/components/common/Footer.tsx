import KAKAO_LOGO from '@/assets/footer/kakao-logo.svg?react';
import TECHPO_LOGO from '@/assets/footer/tfi-logo.svg?react';

function Footer() {
  return (
    <footer className="h-[80px] border-t border-t-grayscale-3 bg-white px-6 py-5 transition-opacity duration-300">
      <div className="flex flex-col gap-[10px] leading-3 text-grayscale-40">
        <div className="flex items-center gap-3">
          <KAKAO_LOGO />|
          <span
            className="cursor-pointer"
            onClick={() => window.open('https://techforimpact.io/', '_blank')}>
            <TECHPO_LOGO />
          </span>
        </div>
        <div className="text-xs text-grayscale-60">
          본 서비스는 카카오임팩트 재단의 지원과 테크포임팩트 커뮤니티의 기여로
          개발되었습니다.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
