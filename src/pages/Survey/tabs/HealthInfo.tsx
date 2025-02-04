import CardContainer from '@/components/common/CardContainer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { useCallback, useEffect, useMemo } from 'react';
import { HealthInformationDTO } from '@/api';
import { useCounselSurveyStore } from '@/pages/Survey/store/surveyInfoStore';
import {
  diseaseList,
  isAllergyTypes,
  isMedicineTypes,
} from '@/pages/Survey/constants/healthInfo';
import { Textarea } from '@/components/ui/textarea';

type SectionFields = Record<string, string | undefined>;
type ButtonOption = {
  label: string;
  value: string | number | boolean;
};
const HealthInfo = () => {
  // counselAssistantStore에서 counselAssistant와 setCounselAssistant를 가져옴
  const { counselSurvey, setCounselSurvey } = useCounselSurveyStore();

  // `useMemo`를 사용하여 `formData`가 불필요하게 재생성되지 않도록 최적화
  const formData = useMemo(
    () => ({
      ...counselSurvey.healthInformation,
      version: '1.1',
      diseaseInfo: counselSurvey.healthInformation?.diseaseInfo || {},
      allergy: counselSurvey.healthInformation?.allergy || {},
      medicationSideEffect:
        counselSurvey.healthInformation?.medicationSideEffect || {},
    }),
    [counselSurvey.healthInformation],
  );

  // `useCallback`으로 `updateFormData` 메모이제이션 (의존성 배열 변화 방지)
  const updateFormData = useCallback(
    (
      section: keyof HealthInformationDTO,
      updates: Record<string, string | number | boolean>,
    ) => {
      setCounselSurvey(
        (prevState: { healthInformation?: HealthInformationDTO }) => ({
          ...prevState,
          healthInformation: {
            ...prevState.healthInformation,
            [section]: {
              ...(typeof prevState.healthInformation?.[section] === 'object' &&
              prevState.healthInformation?.[section] !== null
                ? prevState.healthInformation?.[section]
                : {}),
              ...updates,
            },
          },
        }),
      );
    },
    [setCounselSurvey],
  );

  // 알레르기, 약물 부작용 여부가 false일 경우 빈 값으로 초기화
  useEffect(() => {
    if (formData.allergy?.isAllergy === false) {
      updateFormData('allergy', { allergyNote: '' });
    }

    if (formData.medicationSideEffect?.isSideEffect === false) {
      updateFormData('medicationSideEffect', {
        suspectedMedicationNote: '',
        symptomsNote: '',
      });
    }
  }, [
    formData.allergy?.isAllergy,
    formData.medicationSideEffect?.isSideEffect,
    updateFormData,
  ]);

  // 입력값 함수
  const handleTextarea = (
    label: string,
    placeholder: string,
    section: keyof HealthInformationDTO,
    fieldName: string,
    condition?: boolean,
  ) => {
    if (condition === undefined || condition) {
      return (
        <div className="p-4">
          <Label htmlFor={fieldName} className="font-bold">
            {label}
          </Label>
          <Textarea
            id={fieldName}
            name={fieldName}
            placeholder={placeholder}
            value={(formData[section] as SectionFields)?.[fieldName] ?? ''}
            onChange={(e) =>
              updateFormData(section, { [e.target.name]: e.target.value })
            }
            className="mt-3 pb-36"
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
    section: keyof HealthInformationDTO,
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
    section: keyof HealthInformationDTO,
    field: string,
    value: string,
  ) => {
    setCounselSurvey(
      (prevState: { healthInformation?: HealthInformationDTO }) => {
        // `section`을 안전하게 가져오기 (초기값을 빈 객체로 설정)
        const sectionData = prevState.healthInformation?.[section] ?? {};

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
          healthInformation: {
            ...prevState.healthInformation,
            [section]: {
              ...(typeof sectionData === 'object' && sectionData !== null
                ? sectionData
                : {}),
              [field]: updatedValues, // 배열 유지
            },
          },
        };
      },
    );
  };

  // 배열 값 토글 함수
  const renderMultiSelectButtons = (
    label: string,
    options: ButtonOption[],
    section: keyof HealthInformationDTO,
    field: string,
  ) => {
    return (
      <div className="p-4">
        <Label htmlFor={field} className="font-bold">
          {label}
        </Label>
        <div className="gap-2">
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
              className="py-[6px] px-2 mt-3 mr-2 font-medium rounded-lg"
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
    <TabContentContainer>
      <div className="flex items-start justify-between space-x-4">
        {/* 앓고 있는 질병 입력 */}
        <CardContainer
          title="앓고 있는 질병"
          variant="primary"
          itemName="baseInfo"
          className="py-7">
          {renderMultiSelectButtons(
            '질병',
            diseaseList,
            'diseaseInfo',
            'diseases',
          )}
          {handleTextarea(
            '질병 및 수술 이력',
            '과거 질병 및 수술 이력을 작성해주세요.',
            'diseaseInfo',
            'historyNote',
          )}
          {handleTextarea(
            '주요 불편 증상',
            '건강상 불편한 점을 작성해주세요.',
            'diseaseInfo',
            'mainInconvenienceNote',
          )}
        </CardContainer>
      </div>

      <div className="flex items-start justify-between space-x-4">
        <CardContainer title="알레르기" itemName="baseInfo" className="py-7">
          {renderButtons(
            '알레르기 여부',
            isAllergyTypes,
            'allergy',
            'isAllergy',
          )}
          {handleTextarea(
            '의심 식품/약물',
            '예: 땅콩, 돼지고기',
            'allergy',
            'allergyNote',
            formData.allergy?.isAllergy,
          )}
        </CardContainer>
      </div>

      <div className="flex items-start justify-between space-x-4">
        <CardContainer title="약물 부작용" itemName="baseInfo" className="py-7">
          {renderButtons(
            '약물 부작용 여부',
            isMedicineTypes,
            'medicationSideEffect',
            'isSideEffect',
          )}
          {handleTextarea(
            '부작용 의심 약물',
            '예: 항암제',
            'medicationSideEffect',
            'suspectedMedicationNote',
            formData.medicationSideEffect?.isSideEffect,
          )}
          {handleTextarea(
            '부작용 증상',
            '예: 손발 저림, 오심, 구토, 탈모',
            'medicationSideEffect',
            'symptomsNote',
            formData.medicationSideEffect?.isSideEffect,
          )}
        </CardContainer>
      </div>
    </TabContentContainer>
  );
};

export default HealthInfo;
