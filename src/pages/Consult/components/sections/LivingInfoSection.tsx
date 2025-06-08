import React from 'react';
import {
  CounselCardLivingInformationRes,
  SmokingDTOSmokingAmountEnum,
  MedicationManagementDTOMedicationAssistantsEnum,
  DrinkingDTODrinkingAmountEnum,
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LivingInfoSectionProps {
  livingInfoData: CounselCardLivingInformationRes | null | undefined;
}

const LivingInfoSection: React.FC<LivingInfoSectionProps> = ({
  livingInfoData,
}) => {
  // 흡연 데이터 구성
  const isSmokingUser =
    livingInfoData?.smoking?.smokingAmount &&
    livingInfoData.smoking.smokingAmount !== SmokingDTOSmokingAmountEnum.None;
  const smokingItems = isSmokingUser
    ? [
        {
          label: '총 흡연 기간',
          value: livingInfoData?.smoking?.smokingPeriodNote || null,
        },
        {
          label: '하루 평균 흡연량',
          value: livingInfoData?.smoking?.smokingAmount
            ? SMOKING_AMOUNT_MAP[livingInfoData.smoking.smokingAmount]
            : null,
        },
      ]
    : [];

  // 음주 데이터 구성
  const isDrinkingUser =
    livingInfoData?.drinking?.drinkingAmount &&
    livingInfoData.drinking.drinkingAmount !==
      DrinkingDTODrinkingAmountEnum.None;
  const drinkingItems = isDrinkingUser
    ? [
        {
          label: '음주 횟수',
          value: livingInfoData?.drinking?.drinkingAmount
            ? DRINKING_FREQUENCY_MAP[livingInfoData.drinking.drinkingAmount]
            : null,
        },
      ]
    : [];

  // 운동 데이터 구성
  const exercisePattern = livingInfoData?.exercise?.exercisePattern;
  const getExerciseBadgeText = () => {
    if (!exercisePattern) return null;
    return EXERCISE_PATTERN_MAP[exercisePattern];
  };

  const exerciseItems = [
    {
      label: '운동 종류',
      value: livingInfoData?.exercise?.exerciseNote || null,
    },
  ];

  // 약 복용 관리 데이터 구성
  const isAlone = livingInfoData?.medicationManagement?.isAlone;
  const medicationManagementItems = [
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
    <div>
      <h2 className="text-foreground mb-4 text-xl font-bold">생활 정보</h2>
      <div className="space-y-4 rounded-lg border bg-secondary-10 p-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {/* 첫 번째 행: 흡연 | 음주 */}
          <ContentCard
            title="흡연"
            items={smokingItems}
            hasHistory={true}
            historyActive={true}
            badgeVariant={isSmokingUser ? 'errorLight' : 'primaryLight'}
            badgeText={isSmokingUser ? '흡연' : '비흡연'}
            horizontalLayout={true}
            className="h-full"
          />

          <ContentCard
            title="음주"
            items={drinkingItems}
            hasHistory={true}
            historyActive={false}
            badgeVariant={isDrinkingUser ? 'errorLight' : 'primaryLight'}
            badgeText={isDrinkingUser ? '음주' : '비음주'}
            horizontalLayout={true}
            className="h-full"
          />

          {/* 두 번째 행: 운동 | 약 복용 관리 */}
          <Card className="h-full p-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-subtitle2 font-semibold">운동</h3>
                </div>
                {getExerciseBadgeText() && (
                  <Badge className="bg-grayscale-10 text-grayscale-70 hover:bg-grayscale-10">
                    {getExerciseBadgeText()}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {exerciseItems.map((item, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <span className="text-body1 font-semibold text-grayscale-100">
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      'text-body1 font-normal',
                      item.value ? 'text-grayscale-80' : 'text-grayscale-50',
                    )}>
                    {item.value || '(정보 없음)'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="h-full p-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-subtitle2 font-semibold">약 복용 관리</h3>
                  <History className="text-primary hover:text-primary/80 h-6 w-6 cursor-pointer rounded-lg bg-grayscale-5 p-[2px]" />
                </div>
                {livingInfoData?.medicationManagement?.isAlone !== null && (
                  <Badge className="bg-grayscale-10 text-grayscale-70 hover:bg-grayscale-10">
                    {isAlone ? '독거' : '동거'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicationManagementItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-body1 font-semibold text-grayscale-100">
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      'text-body1 font-normal',
                      item.value ? 'text-grayscale-80' : 'text-grayscale-50',
                    )}>
                    {item.value || '(정보 없음)'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 세 번째 행: 영양 상태 (전체 너비) */}
          <Card className="h-fit p-4 md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-subtitle2 font-semibold">영양 상태</h3>
                  <History className="text-primary hover:text-primary/80 h-6 w-6 cursor-pointer rounded-lg bg-grayscale-5 p-[2px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 첫 번째 행: 하루 식사 패턴과 수분 섭취량 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col space-y-1">
                  <span className="text-body1 font-semibold text-grayscale-100">
                    하루 식사 패턴
                  </span>
                  <span
                    className={cn(
                      'text-body1 font-normal',
                      livingInfoData?.nutrition?.mealPattern
                        ? 'text-grayscale-80'
                        : 'text-grayscale-50',
                    )}>
                    {livingInfoData?.nutrition?.mealPattern
                      ? MEAL_PATTERN_MAP[livingInfoData.nutrition.mealPattern]
                      : '(정보 없음)'}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-body1 font-semibold text-grayscale-100">
                    수분 섭취량
                  </span>
                  <span
                    className={cn(
                      'text-body1 font-normal',
                      livingInfoData?.nutrition?.waterIntake
                        ? 'text-grayscale-80'
                        : 'text-grayscale-50',
                    )}>
                    {livingInfoData?.nutrition?.waterIntake
                      ? WATER_INTAKE_MAP[livingInfoData.nutrition.waterIntake]
                      : '(정보 없음)'}
                  </span>
                </div>
              </div>

              {/* 두 번째 행: 식생활 특이사항 */}
              <div className="flex flex-col space-y-1">
                <span className="text-body1 font-semibold text-grayscale-100">
                  식생활 특이사항
                </span>
                <span
                  className={cn(
                    'text-body1 font-normal',
                    livingInfoData?.nutrition?.nutritionNote
                      ? 'text-grayscale-80'
                      : 'text-grayscale-50',
                  )}>
                  {livingInfoData?.nutrition?.nutritionNote || '(정보 없음)'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LivingInfoSection;
