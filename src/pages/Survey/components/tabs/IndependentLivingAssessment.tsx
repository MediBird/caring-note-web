import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/cardSection';

export default function IndependentLivingAssessment() {
  return (
    <Card>
      <CardSection
        title="보행"
        variant="grayscale"
        items={[
          {
            label: '보행 여부',
            subLabel: '여러 개를 동시에 선택할 수 있어요',
            value: '',
            //     value: <ButtonGroup options={[
            //     {
            //       value: AddCounseleeReqGenderTypeEnum.Female,
            //       label: '여성',
            //     },
            //     {
            //       value: AddCounseleeReqGenderTypeEnum.Male,
            //       label: '남성',
            //     },
            //   ]}
            //   value={formData.genderType}
            //   onChange={(value) =>
            //     setFormData({
            //       ...formData,
            //       genderType: value as AddCounseleeReqGenderTypeEnum,
            //     })
            //   }

            // ]} />,
          },
        ]}
      />
    </Card>
  );
}
