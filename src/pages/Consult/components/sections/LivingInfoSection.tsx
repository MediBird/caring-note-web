import React from 'react';
import {
  CounselCardLivingInformationRes,
  SmokingDTOSmokingAmountEnum,
  MedicationManagementDTOMedicationAssistantsEnum,
} from '@/api';
import {
  SMOKING_AMOUNT_MAP,
  DRINKING_FREQUENCY_MAP,
  MEAL_PATTERN_MAP,
  WATER_INTAKE_MAP,
  EXERCISE_PATTERN_MAP,
  MEDICATION_ASSISTANTS_MAP,
} from '@/utils/constants';
import ContentCard from '@/components/common/ContentCard';
import SectionContainer from '@/components/common/SectionContainer';

interface LivingInfoSectionProps {
  livingInfoData: CounselCardLivingInformationRes | null | undefined;
}

const LivingInfoSection: React.FC<LivingInfoSectionProps> = ({
  livingInfoData,
}) => {
  const smokingItems = [
    {
      label: '흡연 여부',
      value:
        livingInfoData?.smoking?.smokingAmount !==
        SmokingDTOSmokingAmountEnum.None
          ? '흡연'
          : '비흡연',
    },
    ...(livingInfoData?.smoking?.smokingAmount !==
    SmokingDTOSmokingAmountEnum.None
      ? [
          {
            label: '총 흡연기간',
            value: livingInfoData?.smoking?.smokingPeriodNote || null,
          },
          {
            label: '하루 평균 흡연량',
            value: livingInfoData?.smoking?.smokingAmount
              ? SMOKING_AMOUNT_MAP[livingInfoData.smoking.smokingAmount]
              : null,
          },
        ]
      : []),
  ];

  const drinkingItems = [
    {
      label: '음주 여부',
      value:
        livingInfoData?.drinking?.drinkingAmount !== 'NONE' ? '음주' : '비음주',
    },
    ...(livingInfoData?.drinking?.drinkingAmount !== 'NONE'
      ? [
          {
            label: '음주 횟수',
            value: livingInfoData?.drinking?.drinkingAmount
              ? DRINKING_FREQUENCY_MAP[livingInfoData.drinking.drinkingAmount]
              : null,
          },
        ]
      : []),
  ];

  const nutritionItems = [
    {
      label: '하루 식사 패턴',
      value: livingInfoData?.nutrition?.mealPattern
        ? MEAL_PATTERN_MAP[livingInfoData.nutrition.mealPattern]
        : null,
    },
    {
      label: '수분 섭취량',
      value: livingInfoData?.nutrition?.waterIntake
        ? WATER_INTAKE_MAP[livingInfoData.nutrition.waterIntake]
        : null,
    },
    {
      label: '식생활 특이사항',
      value: livingInfoData?.nutrition?.nutritionNote || null,
    },
  ];

  const exerciseItems = [
    {
      label: '주간 운동 패턴',
      value: livingInfoData?.exercise?.exercisePattern
        ? EXERCISE_PATTERN_MAP[livingInfoData.exercise.exercisePattern]
        : null,
    },
    {
      label: '운동 종류',
      value: livingInfoData?.exercise?.exerciseNote || null,
    },
  ];

  const medicationManagementItems = [
    {
      label: '독거 여부',
      value: livingInfoData?.medicationManagement?.isAlone ? '혼자' : '동거',
    },
    {
      label: '동거인 구성원',
      value: livingInfoData?.medicationManagement?.houseMateNote || null,
    },
    {
      label: '복용자 및 투약 보조자',
      value:
        livingInfoData?.medicationManagement?.medicationAssistants
          ?.map((assistant) => MEDICATION_ASSISTANTS_MAP[assistant])
          .join(', ') || null,
    },
    ...(livingInfoData?.medicationManagement?.medicationAssistants?.includes(
      MedicationManagementDTOMedicationAssistantsEnum.Other,
    ) && livingInfoData?.medicationManagement?.customMedicationAssistant
      ? [
          {
            label: '기타 투약 보조자',
            value:
              livingInfoData.medicationManagement.customMedicationAssistant,
          },
        ]
      : []),
  ];

  return (
    <SectionContainer title="생활 정보" variant="secondary">
      <ContentCard
        title="흡연"
        items={smokingItems}
        hasHistory={true}
        historyActive={true}
        badgeVariant={
          livingInfoData?.smoking?.smokingAmount !==
          SmokingDTOSmokingAmountEnum.None
            ? 'destructive'
            : 'secondary'
        }
        badgeText={
          livingInfoData?.smoking?.smokingAmount !==
          SmokingDTOSmokingAmountEnum.None
            ? '주의'
            : '정상'
        }
      />
      <ContentCard
        title="음주"
        items={drinkingItems}
        hasHistory={false}
        badgeVariant={
          livingInfoData?.drinking?.drinkingAmount !== 'NONE'
            ? 'destructive'
            : 'secondary'
        }
        badgeText={
          livingInfoData?.drinking?.drinkingAmount !== 'NONE' ? '주의' : '정상'
        }
      />
      <ContentCard
        title="영양상태"
        items={nutritionItems}
        hasHistory={false}
        badgeVariant="default"
        badgeText="영양"
      />
      <ContentCard
        title="운동"
        items={exerciseItems}
        hasHistory={false}
        badgeVariant="default"
        badgeText="운동"
      />
      <ContentCard
        title="약 복용 관리"
        items={medicationManagementItems}
        hasHistory={false}
        badgeVariant="default"
        badgeText="관리"
        className="md:col-span-2"
      />
    </SectionContainer>
  );
};

export default LivingInfoSection;
