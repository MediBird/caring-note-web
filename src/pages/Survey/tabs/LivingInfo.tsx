import CardContainer from '@/components/common/CardContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { useCallback, useEffect, useMemo } from 'react';
import { LivingInformationDTO } from '@/api';
import { useCounselSurveyStore } from '@/pages/Survey/store/surveyInfoStore';
import {
  isAloneTypes,
  isDrinkingTypes,
  isSmokingTypes,
  medicinetakingMembers,
  smokingAmount,
  drkingWeeklyCounts,
  dailyEatingTypes,
  exerciseWeeklyCounts,
} from '@/pages/Survey/constants/livingInfo';

type SectionFields = Record<string, string | undefined>;
type ButtonOption = {
  label: string;
  value: string | number | boolean; // Specify the expected types here
};

const LivingInfo = () => {
  const { counselSurvey, setCounselSurvey } = useCounselSurveyStore();

  const formData = useMemo(
    () => ({
      ...counselSurvey.livingInformation,
      version: '1.1',
      smoking: counselSurvey.livingInformation?.smoking || {},
      drinking: counselSurvey.livingInformation?.drinking || {},
      nutrition: counselSurvey.livingInformation?.nutrition || {},
      exercise: counselSurvey.livingInformation?.exercise || {},
      medicationManagement:
        counselSurvey.livingInformation?.medicationManagement || {},
    }),
    [counselSurvey.livingInformation],
  );

  // `useCallback`으로 `updateFormData` 메모이제이션 (의존성 배열 변화 방지)
  const updateFormData = useCallback(
    (
      section: keyof LivingInformationDTO,
      updates: Record<string, string | number | boolean>,
    ) => {
      setCounselSurvey((prevState) => ({
        ...prevState,
        livingInformation: {
          ...prevState.livingInformation,
          [section]: {
            ...(typeof prevState.livingInformation?.[section] === 'object' &&
            prevState.livingInformation?.[section] !== null
              ? prevState.livingInformation?.[section]
              : {}),
            ...updates,
          },
        },
      }));
    },
    [setCounselSurvey],
  );

  // 흡연, 음주, 주간 운동패턴, 약복용 관리의 특이사항이 false일 경우 빈 값으로 초기화
  useEffect(() => {
    if (formData.smoking?.isSmoking === false) {
      updateFormData('smoking', {
        smokingPeriodNote: '',
        smokingAmount: '',
      });
    }
    if (formData.drinking?.isDrinking === false) {
      updateFormData('drinking', { drinkingAmount: '' });
    }
    if (formData.exercise?.exercisePattern === '운동 안 함') {
      updateFormData('exercise', { exerciseNote: '' });
    }
    if (formData.medicationManagement?.isAlone === true) {
      updateFormData('medicationManagement', { houseMateNote: '' });
    }
  }, [
    formData.smoking?.isSmoking,
    formData.drinking?.isDrinking,
    formData.exercise?.exercisePattern,
    formData.medicationManagement?.isAlone,
    updateFormData,
  ]);

  // 입력값 함수
  const handleInput = (
    label: string,
    placeholder: string,
    section: keyof LivingInformationDTO,
    fieldName: string,
    condition?: boolean,
  ) => {
    if (condition === undefined || condition) {
      return (
        <div className="p-4">
          <Label htmlFor={fieldName} className="font-bold">
            {label}
          </Label>
          <Input
            id={fieldName}
            name={fieldName}
            placeholder={placeholder}
            value={(formData[section] as SectionFields)?.[fieldName] ?? ''}
            onChange={(e) =>
              updateFormData(section, { [e.target.name]: e.target.value })
            }
            className="mt-3"
          />
        </div>
      );
    }
    return null;
  };

  // 버튼 렌더링 함수
  const renderButtons = (
    label: string,
    options: ButtonOption[],
    section: keyof LivingInformationDTO,
    field: string,
    condition?: boolean,
  ) => {
    if (condition === undefined || condition) {
      return (
        <div className="p-4">
          <Label htmlFor={field} className="font-bold">
            {label}
          </Label>
          <div className="flex gap-2">
            {options.map((option) => (
              <Button
                key={option.label}
                type="button"
                variant={
                  (formData[section] as SectionFields)?.[field] === option.value
                    ? 'pressed'
                    : 'nonpressed'
                }
                className="pl-3 pr-3 mt-3 font-medium rounded-lg"
                size="lg"
                onClick={() =>
                  updateFormData(section, { [field]: option.value })
                }>
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  // 배열 값 토글 함수
  const toggleArrayValue = (
    section: keyof LivingInformationDTO,
    field: string,
    value: string,
  ) => {
    setCounselSurvey((prevState) => {
      // `section`을 안전하게 가져오기 (초기값을 빈 객체로 설정)
      const sectionData = prevState.livingInformation?.[section] ?? {};

      // 현재 필드의 값을 배열로 변환 (string | string[]만 허용)
      let currentValues: string[] = [];

      if (Array.isArray((sectionData as Record<string, unknown>)[field])) {
        currentValues = [...(sectionData as Record<string, string[]>)[field]];
      } else if (
        typeof (sectionData as Record<string, unknown>)[field] === 'string'
      ) {
        currentValues = (sectionData as Record<string, string>)[field]
          .split(',')
          .filter((v) => v.trim() !== '');
      }

      // 값 추가 또는 제거
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value) // 값 제거
        : [...currentValues, value]; // 값 추가

      // Zustand 상태 업데이트
      return {
        ...prevState,
        livingInformation: {
          ...prevState.livingInformation,
          [section]: {
            ...(typeof sectionData === 'object' && sectionData !== null
              ? sectionData
              : {}),
            [field]: updatedValues, // 배열 유지
          },
        },
      };
    });
  };

  // 배열 값 토글 함수
  const renderMultiSelectButtons = (
    label: string,
    options: ButtonOption[],
    section: keyof LivingInformationDTO,
    field: string,
  ) => {
    return (
      <div className="p-4">
        <Label htmlFor={field} className="font-bold">
          {label}
        </Label>
        <p className="mt-3 mb-3 text-sm text-gray-500">
          여러개를 동시에 선택할 수 있어요.
        </p>
        <div className="flex gap-2">
          {options.map((option) => (
            <Button
              key={option.label}
              type="button"
              variant={
                (formData[section] as SectionFields)?.[field]?.includes(
                  option.value.toString(),
                )
                  ? 'pressed'
                  : 'nonpressed'
              }
              className="pl-3 pr-3 mt-3 font-medium rounded-lg"
              size="lg"
              onClick={() =>
                toggleArrayValue(section, field, option.value.toString())
              }>
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    );
  };
  return (
    <>
      <TabContentContainer>
        {/* 흡연 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer
            title="흡연"
            variant="secondary"
            itemName="baseInfo"
            className="py-7">
            {/* 흡연 여부 */}
            {renderButtons('흡연 여부', isSmokingTypes, 'smoking', 'isSmoking')}

            {/* 흡연 여부가 true일 경우 흡연기간, 하루 평균 흡연량 입력 */}

            {/* 총 흡연기간 */}
            <div className="w-1/4">
              {handleInput(
                '총 흡연기간',
                '예: 10년 6개월',
                'smoking',
                'smokingPeriodNote',
                formData.smoking?.isSmoking,
              )}
            </div>

            {/* 하루 평균 흡연량 */}
            {renderButtons(
              '하루 평균 흡연량',
              smokingAmount,
              'smoking',
              'smokingAmount',
              formData.smoking?.isSmoking,
            )}
          </CardContainer>
        </div>

        {/* 음주 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'음주'} itemName="baseInfo" className="py-7">
            {/* 음주 여부 */}
            {renderButtons(
              '음주 여부',
              isDrinkingTypes,
              'drinking',
              'isDrinking',
            )}
            {/*음주 여부가 true일 경우 음주 횟수 입력 */}

            {/* 음주 횟수 */}
            {renderButtons(
              '음주 횟수',
              drkingWeeklyCounts,
              'drinking',
              'drinkingAmount',
              formData.drinking?.isDrinking,
            )}
          </CardContainer>
        </div>

        {/* 영양상태 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer
            title={'영양상태'}
            itemName="baseInfo"
            className="py-7">
            {/* 하루 식사 패턴 */}
            <div className="inline-block w-1/4">
              {renderButtons(
                '하루 식사 패턴',
                dailyEatingTypes,
                'nutrition',
                'mealPattern',
              )}
            </div>

            {/* 식생활 특이사항 */}
            {handleInput(
              '식생활 특이사항',
              '예: 당뇨병 진단',
              'nutrition',
              'nutritionNote',
            )}
          </CardContainer>
        </div>

        {/* 운동 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'운동'} itemName="baseInfo" className="py-7">
            {/* 주간 운동 패턴 */}
            {renderButtons(
              '주간 운동 패턴',
              exerciseWeeklyCounts,
              'exercise',
              'exercisePattern',
            )}

            {/* 규칙적으로 하는 운동 종류 */}
            {handleInput(
              '규칙적으로 하는 운동 종류',
              '예: 조깅, 스쿼트',
              'exercise',
              'exerciseNote',
              formData.exercise?.exercisePattern !== '운동 안 함',
            )}
          </CardContainer>
        </div>

        {/* 약 복용 관리 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer
            title={'약 복용 관리'}
            itemName="baseInfo"
            className="py-7">
            {/* 독거 여부 */}
            {renderButtons(
              '독거 여부',
              isAloneTypes,
              'medicationManagement',
              'isAlone',
            )}
            {/* 동거인 구성원 */}
            {handleInput(
              '동거인 구성원',
              '예: 부모님, 배우자',
              'medicationManagement',
              'houseMateNote',
              !formData.medicationManagement?.isAlone,
            )}
            {/* 복용자 및 투약 보조자 */}
            {renderMultiSelectButtons(
              '복용자 및 투약 보조자',
              medicinetakingMembers,
              'medicationManagement',
              'medicationAssistants',
            )}
          </CardContainer>
        </div>
      </TabContentContainer>
    </>
  );
};
export default LivingInfo;
