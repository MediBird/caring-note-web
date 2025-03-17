import {
  CounselCardLivingInformationRes,
  MedicationManagementDTOMedicationAssistantsEnum,
} from '@/api';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/card-section';
import { Textarea } from '@/components/ui/textarea';
import {
  EXERCISE_PATTERN_OPTIONS,
  MEAL_PATTERN_OPTIONS,
  MEDICATION_ASSISTANTS_OPTIONS,
} from '@/utils/constants';
import { useCounselCardStore } from '../../hooks/counselCardStore';
import { useCounselCardLivingInfoQuery } from '../../hooks/useCounselCardQuery';

interface LivingInfoProps {
  counselSessionId: string;
}

export default function LivingInfo({ counselSessionId }: LivingInfoProps) {
  const { livingInfo, setLivingInfo } = useCounselCardStore();
  const { isLoading } = useCounselCardLivingInfoQuery(counselSessionId);

  const handleUpdateLivingInfo = (
    field: string,
    value: string | string[] | boolean,
  ) => {
    const [section, key] = field.split('.');
    const updatedSection = {
      ...livingInfo?.[section as keyof CounselCardLivingInformationRes],
      [key]: Array.isArray(value) ? new Set(value) : value,
    };

    setLivingInfo({
      ...livingInfo,
      [section]: updatedSection,
    } as CounselCardLivingInformationRes);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const smokingAmountOptions = [
    { label: '흡연', value: 'true' },
    { label: '비흡연', value: 'false' },
  ];
  const drinkingAmountOptions = [
    { label: '음주', value: 'true' },
    { label: '비음주', value: 'false' },
  ];
  const houseMateOptions = [
    { label: '독거', value: 'true' },
    { label: '동거인 있음', value: 'false' },
  ];
  return (
    <Card className="flex w-full flex-col gap-5">
      <CardSection
        title="흡연"
        variant="secondary"
        items={[
          {
            label: '흡연 여부',
            value: (
              <ButtonGroup
                options={smokingAmountOptions}
                value={livingInfo?.smoking?.isSmoking ? 'true' : 'false'}
                onChange={(value) =>
                  handleUpdateLivingInfo('smoking.isSmoking', value === 'true')
                }
              />
            ),
          },
        ]}
      />
      <CardSection
        title="음주"
        items={[
          {
            label: '음주 여부',
            value: (
              <ButtonGroup
                options={drinkingAmountOptions}
                value={livingInfo?.drinking?.isDrinking ? 'true' : 'false'}
                onChange={(value) =>
                  handleUpdateLivingInfo(
                    'drinking.isDrinking',
                    value === 'true',
                  )
                }
              />
            ),
          },
        ]}
      />
      <CardSection
        title="영양 상태"
        items={[
          {
            label: '하루 식사 패턴',
            value: (
              <ButtonGroup
                options={MEAL_PATTERN_OPTIONS}
                value={livingInfo?.nutrition?.mealPattern || ''}
                onChange={(value) =>
                  handleUpdateLivingInfo('nutrition.mealPattern', value)
                }
              />
            ),
          },
          {
            label: '식생활 특이사항',
            value: (
              <Textarea
                placeholder="참고할 식생활 특이사항을 작성해주세요."
                className="w-full rounded border p-2"
                value={livingInfo?.nutrition?.nutritionNote || ''}
                onChange={(e) =>
                  handleUpdateLivingInfo(
                    'nutrition.nutritionNote',
                    e.target.value,
                  )
                }
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
            value: (
              <ButtonGroup
                options={EXERCISE_PATTERN_OPTIONS}
                value={livingInfo?.exercise?.exercisePattern || ''}
                onChange={(value) =>
                  handleUpdateLivingInfo('exercise.exercisePattern', value)
                }
              />
            ),
          },
          {
            label: '운동 특이사항',
            value: (
              <Textarea
                placeholder="운동 특이사항을 작성해주세요."
                className="w-full rounded border p-2"
                value={livingInfo?.exercise?.exerciseNote || ''}
                onChange={(e) =>
                  handleUpdateLivingInfo(
                    'exercise.exerciseNote',
                    e.target.value,
                  )
                }
              />
            ),
          },
        ]}
      />
      <CardSection
        title="약 복용 관리"
        items={[
          {
            label: '독거 여부',
            value: (
              <ButtonGroup
                options={houseMateOptions}
                value={
                  livingInfo?.medicationManagement?.isAlone ? 'true' : 'false'
                }
                onChange={(value) =>
                  handleUpdateLivingInfo(
                    'medicationManagement.isAlone',
                    value === 'true',
                  )
                }
              />
            ),
          },
          {
            label: '동거인 구성원',
            value: (
              <Textarea
                placeholder="구성원과의 관계를 작성해주세요."
                className="w-full rounded border p-2"
                value={livingInfo?.medicationManagement?.houseMateNote || ''}
                onChange={(e) =>
                  handleUpdateLivingInfo(
                    'medicationManagement.houseMateNote',
                    e.target.value,
                  )
                }
              />
            ),
          },
          {
            label: '복용자 및 투약 보조자',
            subLabel: '여러 개를 동시에 선택 할 수 있어요.',
            value: (
              <ButtonGroup
                options={MEDICATION_ASSISTANTS_OPTIONS}
                value={Array.from(
                  livingInfo?.medicationManagement?.medicationAssistants || [],
                )}
                onChange={(value) => {
                  const enumValue =
                    value as MedicationManagementDTOMedicationAssistantsEnum;
                  let currentAssistants = Array.from(
                    livingInfo?.medicationManagement?.medicationAssistants ||
                      [],
                  );

                  if (currentAssistants.includes(enumValue)) {
                    currentAssistants = currentAssistants.filter(
                      (assistant) => assistant !== enumValue,
                    );
                  } else {
                    currentAssistants.push(enumValue);
                  }

                  setLivingInfo({
                    ...livingInfo,
                    medicationManagement: {
                      ...livingInfo?.medicationManagement,
                      medicationAssistants: currentAssistants,
                    },
                  });
                }}
                multiple={true}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
