import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/cardSection';
import { Textarea } from '../../../../components/ui/textarea';

export default function HealthInfo() {
  return (
    <Card>
      <CardSection
        title="앓고 있는 질병"
        items={[
          {
            label: '앓고 있는 질병',
            value: '',
          },
          {
            label: '질병 및 수술 이력',
            value: (
              <Textarea
                placeholder="과거 질병 및 수술 이력을 작성해주세요."
                className="min-h-[100px] w-full rounded border p-2"
              />
            ),
          },
          {
            label: '주요 불편 증상',
            value: (
              <Textarea
                placeholder="건강상 불편한 점을 작성해주세요."
                className="min-h-[100px] w-full rounded border p-2"
              />
            ),
          },
        ]}
      />
      <CardSection
        title="알레르기"
        items={[
          {
            label: '알레르기 유무',
            value: '',
          },
        ]}
      />
      <CardSection
        title="약물 부작용"
        items={[
          {
            label: '약물 부작용 여부',
            value: '',
          },
        ]}
      />
    </Card>
  );
}
