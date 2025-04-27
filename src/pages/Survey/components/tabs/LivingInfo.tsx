import {
  CounselCardLivingInformationRes,
  DrinkingDTODrinkingAmountEnum,
  MedicationManagementDTOMedicationAssistantsEnum,
  SmokingDTOSmokingAmountEnum,
} from '@/api';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/card-section';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DRINKING_FREQUENCY_OPTIONS,
  DRINKING_OPTIONS,
  EXERCISE_PATTERN_OPTIONS,
  MEAL_PATTERN_OPTIONS,
  MEDICATION_ASSISTANTS_OPTIONS,
  SMOKING_AMOUNT_OPTIONS,
  SMOKING_OPTIONS,
  WATER_INTAKE_OPTIONS,
} from '@/utils/constants';
import { useCounselCardStore } from '../../hooks/counselCardStore';

export default function LivingInfo() {
  const { infoData, setInfoData } = useCounselCardStore();
  const livingInfo = infoData.living;

  const handleUpdateLivingInfo = (
    field: string,
    value: string | string[] | boolean | undefined | null,
  ) => {
    const [section, key] = field.split('.');
    const updatedSection = {
      ...livingInfo?.[section as keyof CounselCardLivingInformationRes],
      [key]: Array.isArray(value) ? new Set(value) : value,
    };

    setInfoData('living', {
      ...livingInfo,
      [section]: updatedSection,
    } as CounselCardLivingInformationRes);
  };

  const smokingAmountOptions = SMOKING_OPTIONS;
  const smokingPackOptions = SMOKING_AMOUNT_OPTIONS;
  const drinkingAmountOptions = DRINKING_OPTIONS;
  const drinkingFrequencyOptions = DRINKING_FREQUENCY_OPTIONS;

  const houseMateOptions = [
    { label: '독거', value: 'true' },
    { label: '동거', value: 'false' },
  ];

  const isSmoker =
    livingInfo?.smoking?.smokingAmount !== undefined &&
    livingInfo?.smoking?.smokingAmount !== null &&
    livingInfo.smoking.smokingAmount !== SmokingDTOSmokingAmountEnum.None;

  const isDrinker =
    livingInfo?.drinking?.drinkingAmount !== undefined &&
    livingInfo?.drinking?.drinkingAmount !== null &&
    livingInfo?.drinking?.drinkingAmount !== DrinkingDTODrinkingAmountEnum.None;

  const isOtherAssistantSelected =
    livingInfo?.medicationManagement?.medicationAssistants?.includes(
      MedicationManagementDTOMedicationAssistantsEnum.Other,
    );

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
                value={
                  isSmoker
                    ? 'true'
                    : livingInfo?.smoking?.smokingAmount ===
                        SmokingDTOSmokingAmountEnum.None
                      ? 'false'
                      : ''
                }
                onChange={(value) => {
                  if (
                    (value === 'true' && isSmoker) ||
                    (value === 'false' &&
                      livingInfo?.smoking?.smokingAmount ===
                        SmokingDTOSmokingAmountEnum.None)
                  ) {
                    handleUpdateLivingInfo('smoking.smokingAmount', null);
                  } else if (value === 'false') {
                    handleUpdateLivingInfo(
                      'smoking.smokingAmount',
                      SmokingDTOSmokingAmountEnum.None,
                    );
                  } else {
                    handleUpdateLivingInfo(
                      'smoking.smokingAmount',
                      SmokingDTOSmokingAmountEnum.OnePack,
                    );
                  }
                }}
              />
            ),
          },
          ...(isSmoker
            ? [
                {
                  label: '총 흡연기간',
                  value: (
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        className="w-[11rem]"
                        placeholder="00년 00개월"
                        value={livingInfo?.smoking?.smokingPeriodNote || ''}
                        onChange={(e) =>
                          handleUpdateLivingInfo(
                            'smoking.smokingPeriodNote',
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  ),
                },
                {
                  label: '흡연량',
                  value: (
                    <ButtonGroup
                      options={smokingPackOptions}
                      value={
                        livingInfo?.smoking?.smokingAmount ||
                        SmokingDTOSmokingAmountEnum.OnePack
                      }
                      onChange={(value) =>
                        handleUpdateLivingInfo('smoking.smokingAmount', value)
                      }
                    />
                  ),
                },
              ]
            : []),
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
                value={
                  isDrinker
                    ? 'true'
                    : livingInfo?.drinking?.drinkingAmount ===
                        DrinkingDTODrinkingAmountEnum.None
                      ? 'false'
                      : ''
                }
                onChange={(value) => {
                  if (
                    (value === 'true' && isDrinker) ||
                    (value === 'false' &&
                      livingInfo?.drinking?.drinkingAmount ===
                        DrinkingDTODrinkingAmountEnum.None)
                  ) {
                    handleUpdateLivingInfo('drinking.drinkingAmount', null);
                  } else if (value === 'true') {
                    handleUpdateLivingInfo(
                      'drinking.drinkingAmount',
                      DrinkingDTODrinkingAmountEnum.OnceAWeek,
                    );
                  } else {
                    handleUpdateLivingInfo(
                      'drinking.drinkingAmount',
                      DrinkingDTODrinkingAmountEnum.None,
                    );
                  }
                }}
              />
            ),
          },
          ...(isDrinker
            ? [
                {
                  label: '음주 빈도',
                  value: (
                    <ButtonGroup
                      options={drinkingFrequencyOptions}
                      value={
                        livingInfo?.drinking?.drinkingAmount || 'ONCE_A_WEEK'
                      }
                      onChange={(value) =>
                        handleUpdateLivingInfo('drinking.drinkingAmount', value)
                      }
                    />
                  ),
                },
              ]
            : []),
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
                onChange={(value) => {
                  const newValue =
                    livingInfo?.nutrition?.mealPattern === value ? '' : value;
                  handleUpdateLivingInfo('nutrition.mealPattern', newValue);
                }}
              />
            ),
          },
          {
            label: '하루 수분 섭취량',
            value: (
              <ButtonGroup
                options={WATER_INTAKE_OPTIONS}
                value={livingInfo?.nutrition?.waterIntake || ''}
                onChange={(value) => {
                  const newValue =
                    livingInfo?.nutrition?.waterIntake === value ? '' : value;
                  handleUpdateLivingInfo('nutrition.waterIntake', newValue);
                }}
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
                onChange={(value) => {
                  const newValue =
                    livingInfo?.exercise?.exercisePattern === value
                      ? ''
                      : value;
                  handleUpdateLivingInfo('exercise.exercisePattern', newValue);
                }}
              />
            ),
          },
          {
            label: '규칙적으로 하는 운동 종류',
            value: (
              <Input
                placeholder="규칙적으로 실행하는 모든 운동 종류를 작성해주세요."
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
                  livingInfo?.medicationManagement?.isAlone === null
                    ? ''
                    : livingInfo?.medicationManagement?.isAlone === true
                      ? 'true'
                      : livingInfo?.medicationManagement?.isAlone === false
                        ? 'false'
                        : ''
                }
                onChange={(value) => {
                  if (
                    (value === 'true' &&
                      livingInfo?.medicationManagement?.isAlone === true) ||
                    (value === 'false' &&
                      livingInfo?.medicationManagement?.isAlone === false)
                  ) {
                    handleUpdateLivingInfo(
                      'medicationManagement.isAlone',
                      null,
                    );
                  } else {
                    handleUpdateLivingInfo(
                      'medicationManagement.isAlone',
                      value === 'true',
                    );
                  }
                }}
              />
            ),
          },
          ...(livingInfo?.medicationManagement?.isAlone === false
            ? [
                {
                  label: '동거인 구성원',
                  value: (
                    <Textarea
                      placeholder="구성원과의 관계를 작성해주세요."
                      className="w-full rounded border p-2"
                      value={
                        livingInfo?.medicationManagement?.houseMateNote || ''
                      }
                      onChange={(e) =>
                        handleUpdateLivingInfo(
                          'medicationManagement.houseMateNote',
                          e.target.value,
                        )
                      }
                    />
                  ),
                },
              ]
            : []),
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

                  setInfoData('living', {
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
          ...(isOtherAssistantSelected
            ? [
                {
                  label: '기타 투약 보조자',
                  value: (
                    <Input
                      placeholder="기타 투약 보조자를 입력해주세요."
                      className="w-full rounded border p-2"
                      value={
                        livingInfo?.medicationManagement
                          ?.customMedicationAssistant || ''
                      }
                      onChange={(e) =>
                        handleUpdateLivingInfo(
                          'medicationManagement.customMedicationAssistant',
                          e.target.value,
                        )
                      }
                    />
                  ),
                },
              ]
            : []),
        ]}
      />
    </Card>
  );
}
