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

  const smokingAmountOptions = SMOKING_OPTIONS;
  const smokingPackOptions = SMOKING_AMOUNT_OPTIONS;
  const drinkingAmountOptions = DRINKING_OPTIONS;
  const drinkingFrequencyOptions = DRINKING_FREQUENCY_OPTIONS;

  const houseMateOptions = [
    { label: '독거', value: 'true' },
    { label: '동거인 있음', value: 'false' },
  ];

  const isSmoker =
    livingInfo?.smoking?.smokingAmount !== undefined &&
    livingInfo.smoking.smokingAmount !== SmokingDTOSmokingAmountEnum.None;

  const isDrinker =
    livingInfo?.drinking?.drinkingAmount !== undefined &&
    livingInfo?.drinking?.drinkingAmount !== 'NONE';

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
                value={isSmoker ? 'true' : 'false'}
                onChange={(value) => {
                  if (value === 'false') {
                    // 비흡연인 경우 smokingAmount를 NONE으로 설정
                    handleUpdateLivingInfo(
                      'smoking.smokingAmount',
                      SmokingDTOSmokingAmountEnum.None,
                    );
                  } else {
                    // 흡연인 경우 기본값 설정
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
                  label: '흡연 기간',
                  value: (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="w-20"
                        placeholder="년"
                        min="0"
                        max="100"
                        value={
                          livingInfo?.smoking?.smokingPeriodNote?.split(
                            '년',
                          )[0] || ''
                        }
                        onChange={(e) => {
                          const years = e.target.value;
                          const months =
                            livingInfo?.smoking?.smokingPeriodNote
                              ?.split('년')[1]
                              ?.split('개월')[0]
                              ?.trim() || '';
                          const periodNote = `${years}년 ${months}개월`;
                          handleUpdateLivingInfo(
                            'smoking.smokingPeriodNote',
                            periodNote,
                          );
                        }}
                      />
                      <span>년</span>
                      <Input
                        type="number"
                        className="w-20"
                        placeholder="개월"
                        min="0"
                        max="11"
                        value={
                          livingInfo?.smoking?.smokingPeriodNote
                            ?.split('년')[1]
                            ?.split('개월')[0]
                            ?.trim() || ''
                        }
                        onChange={(e) => {
                          const years =
                            livingInfo?.smoking?.smokingPeriodNote?.split(
                              '년',
                            )[0] || '';
                          const months = e.target.value;
                          const periodNote = `${years}년 ${months}개월`;
                          handleUpdateLivingInfo(
                            'smoking.smokingPeriodNote',
                            periodNote,
                          );
                        }}
                      />
                      <span>개월</span>
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
                  livingInfo?.drinking?.drinkingAmount !==
                  DrinkingDTODrinkingAmountEnum.None
                    ? 'true'
                    : 'false'
                }
                onChange={(value) =>
                  handleUpdateLivingInfo(
                    'drinking.drinkingAmount',
                    value === 'true'
                      ? DrinkingDTODrinkingAmountEnum.OnceAWeek
                      : DrinkingDTODrinkingAmountEnum.None,
                  )
                }
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
