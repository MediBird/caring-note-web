import { CounselPurposeAndNoteDTOCounselPurposeEnum } from '@/api/api';
import { ButtonGroup, ButtonGroupOption } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/cardSection';
import { Textarea } from '@/components/ui/textarea';
import { useCounselCardBaseInfoStore } from '../../hooks/counselCardStore';
import { useCounselCardBaseInfoQuery } from '../../hooks/useCounselCardQuery';

interface BasicInfoProps {
  counselSessionId: string;
}

const counselPurposeOptions: ButtonGroupOption[] = [
  {
    label: '약물 부작용 상담',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.MedicationSideEffect,
  },
  {
    label: '생활습관 관리',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.LifestyleManagement,
  },
  {
    label: '증상/질병 이해',
    value:
      CounselPurposeAndNoteDTOCounselPurposeEnum.SymptomDiseaseUnderstanding,
  },
  {
    label: '복용약물 검토',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.MedicationReview,
  },
  {
    label: '기타',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.Other,
  },
];

export default function BasicInfo({ counselSessionId }: BasicInfoProps) {
  const { baseInfo, setBaseInfo } = useCounselCardBaseInfoStore();
  const { isLoading } = useCounselCardBaseInfoQuery(counselSessionId);

  const handlePurposeChange = (value: string) => {
    const currentPurposes: CounselPurposeAndNoteDTOCounselPurposeEnum[] =
      Array.from(baseInfo?.counselPurposeAndNote?.counselPurpose || []);
    const enumValue = value as CounselPurposeAndNoteDTOCounselPurposeEnum;

    const updatedPurposes = currentPurposes.includes(enumValue)
      ? currentPurposes.filter(
          (purpose: CounselPurposeAndNoteDTOCounselPurposeEnum) =>
            purpose !== enumValue,
        )
      : [...currentPurposes, enumValue];

    setBaseInfo({
      ...baseInfo,
      counselPurposeAndNote: {
        ...baseInfo?.counselPurposeAndNote,
        counselPurpose: new Set(updatedPurposes),
      },
    });
  };

  const handleUpdateBaseInfo = (
    field: 'significantNote' | 'medicationNote',
    value: string,
  ) => {
    setBaseInfo({
      ...baseInfo,
      counselPurposeAndNote: {
        ...baseInfo?.counselPurposeAndNote,
        [field]: value,
      },
    });
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Card>
      <CardSection
        title="기본 정보"
        variant="grayscale"
        items={[
          {
            label: '성명',
            value: baseInfo?.baseInfo?.counseleeName || '',
          },
          {
            label: '생년월일',
            value: baseInfo?.baseInfo?.birthDate || '',
          },
          {
            label: '의료보장형태',
            subLabel: '',
            value: baseInfo?.baseInfo?.healthInsuranceType || '',
          },
          {
            label: '최근 상담일',
            subLabel: '',
            value: baseInfo?.baseInfo?.lastCounselDate || '',
          },
        ]}
      />
      <CardSection
        title="상담 목적 및 특이사항"
        variant="grayscale"
        items={[
          {
            label: (
              <>
                상담 목적<span className="text-red-500">*</span>
              </>
            ),
            subLabel: '여러 개를 동시에 선택할 수 있어요',
            value: (
              <ButtonGroup
                options={counselPurposeOptions}
                value={Array.from(
                  baseInfo?.counselPurposeAndNote?.counselPurpose || [],
                )}
                onChange={handlePurposeChange}
                className="flex-wrap"
                multiple
              />
            ),
          },
          {
            label: '특이사항',
            subLabel: '',
            value: (
              <Textarea
                id="significantNote"
                className="min-h-[100px] w-full rounded border p-2"
                value={baseInfo?.counselPurposeAndNote?.significantNote || ''}
                onChange={(e) =>
                  handleUpdateBaseInfo('significantNote', e.target.value)
                }
                placeholder="특이사항 혹은 약사에게 궁금한 점을 작성해주세요."
              />
            ),
          },
          {
            label: '의약물',
            subLabel: '',
            value: (
              <Textarea
                id="medicationNote"
                className="min-h-[100px] w-full rounded border p-2"
                value={baseInfo?.counselPurposeAndNote?.medicationNote || ''}
                onChange={(e) =>
                  handleUpdateBaseInfo('medicationNote', e.target.value)
                }
                placeholder="약사님께 전달해 드릴 의약물을 작성해주세요"
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
