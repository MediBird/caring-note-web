import {
  CounselCardLivingInformationRes,
  ExerciseDTOExercisePatternEnum,
  MedicationManagementDTOMedicationAssistantsEnum,
  NutritionDTOMealPatternEnum,
} from '@/api/api';
import { ButtonGroup, ButtonGroupOption } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/cardSection';
import { Textarea } from '@/components/ui/textarea';
import { useCounselCardLivingInfoStore } from '../../hooks/counselCardStore';
import { useCounselCardLivingInfoQuery } from '../../hooks/useCounselCardQuery';

interface LivingInfoProps {
  counselSessionId: string;
}

export default function LivingInfo({ counselSessionId }: LivingInfoProps) {
  const { livingInfo, setLivingInfo } = useCounselCardLivingInfoStore();
  const { isLoading } = useCounselCardLivingInfoQuery(counselSessionId);

  const handleUpdateLivingInfo = (field: string, value: string | string[]) => {
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

  const smokingAmountOptions: ButtonGroupOption[] = [
    { label: '흡연', value: 'true' },
    { label: '비흡연', value: 'false' },
  ];
  const drinkingAmountOptions: ButtonGroupOption[] = [
    { label: '음주', value: 'true' },
    { label: '비음주', value: 'false' },
  ];
  const houseMateOptions: ButtonGroupOption[] = [
    { label: '독거', value: 'true' },
    { label: '동거인 있음', value: 'false' },
  ];
  return (
    <Card>
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
                  handleUpdateLivingInfo('smoking.isSmoking', value)
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
                  handleUpdateLivingInfo('drinking.isDrinking', value)
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
                options={[
                  {
                    label: '하루 1회 규칙적',
                    value: NutritionDTOMealPatternEnum.OneRegularMeal,
                  },
                  {
                    label: '하루 2회 규칙적',
                    value: NutritionDTOMealPatternEnum.TwoRegularMeals,
                  },
                  {
                    label: '하루 3회 규칙적',
                    value: NutritionDTOMealPatternEnum.ThreeRegularMeals,
                  },
                  {
                    label: '불규칙적',
                    value: NutritionDTOMealPatternEnum.IrregularMeals,
                  },
                ]}
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
                options={[
                  {
                    label: '운동 안함',
                    value: ExerciseDTOExercisePatternEnum.NoExercise,
                  },
                  {
                    label: '주 1회',
                    value: ExerciseDTOExercisePatternEnum.OnceAWeek,
                  },
                  {
                    label: '주 2회',
                    value: ExerciseDTOExercisePatternEnum.TwiceAWeek,
                  },
                  {
                    label: '주 3회',
                    value: ExerciseDTOExercisePatternEnum.ThreeTimesAWeek,
                  },
                  {
                    label: '주 4회',
                    value: ExerciseDTOExercisePatternEnum.FourTimesAWeek,
                  },
                  {
                    label: '주 5회 이상',
                    value: ExerciseDTOExercisePatternEnum.FiveOrMoreTimesAWeek,
                  },
                ]}
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
                  livingInfo?.medicationManagement?.isMedicationManagement
                    ? 'true'
                    : 'false'
                }
                onChange={(value) =>
                  handleUpdateLivingInfo(
                    'medicationManagement.isMedicationManagement',
                    value,
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
                options={[
                  {
                    label: '본인',
                    value: MedicationManagementDTOMedicationAssistantsEnum.Self,
                  },
                  {
                    label: '배우자',
                    value:
                      MedicationManagementDTOMedicationAssistantsEnum.Spouse,
                  },
                  {
                    label: '자녀',
                    value:
                      MedicationManagementDTOMedicationAssistantsEnum.Children,
                  },
                  {
                    label: '친척',
                    value:
                      MedicationManagementDTOMedicationAssistantsEnum.Relatives,
                  },
                  {
                    label: '친구',
                    value:
                      MedicationManagementDTOMedicationAssistantsEnum.Friend,
                  },
                  {
                    label: '간병인',
                    value:
                      MedicationManagementDTOMedicationAssistantsEnum.Caregiver,
                  },
                  {
                    label: '기타',
                    value:
                      MedicationManagementDTOMedicationAssistantsEnum.Other,
                  },
                ]}
                value={Array.from(
                  livingInfo?.medicationManagement?.medicationAssistants || [],
                )}
                onChange={(value) =>
                  handleUpdateLivingInfo(
                    'medicationManagement.medicationAssistants',
                    value.split(','),
                  )
                }
                multiple={true}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
