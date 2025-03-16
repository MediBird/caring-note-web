import { Card } from '@/components/ui/card';

import CardSection from '@/components/ui/cardSection';
import { Textarea } from '@/components/ui/textarea';
import { ButtonGroup } from '../../../../components/ui/button-group';
export default function LivingInfo() {
  return (
    <Card>
      <CardSection
        title="흡연"
        items={[
          {
            label: '흡연 여부',
            value: '',
          },
        ]}
      />
      <CardSection
        title="음주"
        items={[
          {
            label: '음주 여부',
            value: '',
          },
        ]}
      />
      <CardSection
        title="영양 상태"
        items={[
          {
            label: '하루 식사 패턴',
            value: '',
          },
          {
            label: '식생활 특이사항',
            value: (
              <Textarea
                placeholder="참고할 식생활 특이사항을 작성해주세요."
                className="w-full rounded border p-2"
              />
            ),
          },
        ]}
      />
      <CardSection
        title="운동"
        items={[
          {
            label: '주간 운동 패턴',
            value: '',
          },
        ]}
      />
      <CardSection
        title="약 복용 관리"
        items={[
          {
            label: '독거 여부',
            value: '',
          },
          {
            label: '복용자 및 투약 보조자',
            subLabel: '여러 개를 동시에 선택 할 수 있어요.',
            value: (
              <ButtonGroup
                options={[
                  {
                    label: '복용자',
                    value: '복용자',
                  },
                  {
                    label: '투약 보조자',
                    value: '투약 보조자',
                  },
                ]}
                value={''}
                onChange={() => {}}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
