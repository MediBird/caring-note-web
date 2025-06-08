import NulpeumImg from '@/assets/site/nulpeum.webp';
import InsuranceImg from '@/assets/site/insurance.webp';
import KimsImg from '@/assets/site/kims.webp';
import KpicImg from '@/assets/site/kpic.webp';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const UsableSiteInfo = [
  {
    name: '늘픔가치',
    description: '사단법인 늘픔가치 공식 웹사이트',
    url: 'https://withnp.campaignus.me/',
    image: NulpeumImg,
    backgroundColor: 'bg-grayscale-3',
  },
  {
    name: '약학정보원',
    description: '대한민국 의약품 정보의 표준',
    url: 'https://www.health.kr/',
    image: KpicImg,
    backgroundColor: 'bg-primary-5',
  },
  {
    name: 'KIMS 의약정보센터',
    description: '국내 최대 의약정보 제공',
    url: 'https://www.kimsonline.co.kr/',
    image: KimsImg,
    backgroundColor: 'bg-grayscale-3',
  },
  {
    name: '건강보험심사평가원',
    description: '최근 1년간의 의약품 내역 확인',
    url: 'https://www.hira.or.kr/rb/dur/form.do?pgmid=HIRAA050300000100&WT.ac=%EB%82%B4%EA%B0%80%EB%A8%B9%EB%8A%94%EC%95%BD%ED%95%9C%EB%88%88%EC%97%90%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0#',
    image: InsuranceImg,
    backgroundColor: 'bg-primary-5',
  },
];

const UsableSiteList = () => {
  return (
    <div className="mt-[60px] grid w-full grid-cols-4 flex-row flex-wrap gap-3">
      {UsableSiteInfo.map((site) => (
        <div
          key={site.name}
          className={cn(
            'flex w-full flex-col items-center gap-2 rounded-[12px] py-5',
            site.backgroundColor,
          )}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <img
              src={site.image}
              alt={site.name}
              className="h-8 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-base font-bold">{site.name}</div>
            <div className="text-xs font-medium">{site.description}</div>
          </div>
          <Button
            variant="primary"
            className="mt-[10px]"
            onClick={() => window.open(site.url, '_blank')}>
            바로가기
          </Button>
        </div>
      ))}
    </div>
  );
};

export default UsableSiteList;
