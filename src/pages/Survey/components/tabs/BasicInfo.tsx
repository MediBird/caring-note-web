import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/cardSection';
import { Textarea } from '@/components/ui/textarea';

export default function BasicInfo() {
  return (
    <Card>
      <CardSection
        title="기본 정보"
        variant="grayscale"
        items={[
          { label: '성명', subLabel: '', value: '' },
          { label: '생년월일', subLabel: '', value: '' },
          { label: '의료보장형태', subLabel: '', value: '' },
          { label: '상담 경험', subLabel: '', value: '' },
          { label: '최근 상담일', subLabel: '', value: '' },
        ]}
      />
      <CardSection
        title="상담 목적 및 특이사항"
        variant="grayscale"
        items={[
          {
            label: '상담 목적',
            subLabel: '여러 개를 동시에 선택할 수 있어요',
            value: '',
          },
          {
            label: '특이사항',
            subLabel: '',
            value: (
              <Textarea
                id="description"
                className="min-h-[100px] w-full rounded border p-2"
                value={''}
                onChange={(e) => {}}
                placeholder="특이사항 혹은 약사에게 궁금한 점을 작성해주세요."
              />
            ),
          },
          {
            label: '의약물',
            subLabel: '',
            value: (
              <Textarea
                id="description"
                className="min-h-[100px] w-full rounded border p-2"
                value={''}
                onChange={(e) => {}}
                placeholder="약사님께 전달해 드릴 의약물을 작성해주세요"
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
