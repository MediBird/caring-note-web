import NulpeumImg from '@/assets/nulpeum.png';
import InsuranceImg from '@/assets/insurance.png';
import KimsImg from '@/assets/kims.png';
import KpicImg from '@/assets/kpic.png';

const UsableSiteList = () => {
  return (
    <div className="flex flex-wrap gap-8 mt-20 ">
      <a
        href="https://withnp.campaignus.me/"
        target="_blank"
        rel="noopener noreferrer">
        <img
          src={NulpeumImg}
          alt="nulpeum-shortcut"
          className="inline-block max-w-[232px]"
        />
      </a>
      <a
        href="https://www.health.kr/"
        target="_blank"
        rel="noopener noreferrer">
        <img
          src={KpicImg}
          alt="kpic-shortcut"
          className="inline-block max-w-[232px] "
        />
      </a>
      <a
        href="https://www.kimsonline.co.kr/"
        target="_blank"
        rel="noopener noreferrer">
        <img
          src={KimsImg}
          alt="kims-shortcut"
          className="inline-block max-w-[232px]"
        />
      </a>
      <a
        href="https://www.hira.or.kr/main.do"
        target="_blank"
        rel="noopener noreferrer">
        <img
          src={InsuranceImg}
          alt="insurance-shortcut"
          className="inline-block max-w-[232px]"
        />
      </a>
    </div>
  );
};

export default UsableSiteList;
