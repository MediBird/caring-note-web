import CardContainer from '@/components/common/CardContainer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { useEffect, useState } from 'react';
import { HealthInformationDTO } from '@/api';
import { useCounselAssistantStore } from '@/pages/Survey/store/surveyInfoStore';
import {
  diseaseList,
  isAllergyTypes,
  isMedicineTypes,
} from '@/pages/Survey/constants/healthInfo';
import { useParams } from 'react-router-dom';
import { useSelectCounselCard } from '@/pages/Survey/hooks/useCounselAssistantQuery';
import { Textarea } from '@/components/ui/textarea';

type SectionFields = Record<string, string | undefined>;
type ButtonOption = {
  label: string;
  value: string | number | boolean;
};
const HealthInfo = () => {
  // useParams()를 통해 counselSessionId를 가져옴
  const { counselSessionId } = useParams();
  // counselAssistantStore에서 counselAssistant와 setCounselAssistant를 가져옴
  const { counselAssistant, setCounselAssistant } = useCounselAssistantStore();
  const { data: selectCounselCardAssistantInfo } = useSelectCounselCard(
    counselSessionId ?? '',
  );

  const [formData, setFormData] = useState<HealthInformationDTO>(
    counselAssistant.healthInformation || {
      diseaseInfo: {},
      allergy: {},
      medicationSideEffect: {},
    },
  );

  useEffect(() => {
    if (selectCounselCardAssistantInfo?.data?.data?.healthInformation) {
      setFormData(
        selectCounselCardAssistantInfo?.data?.data?.healthInformation,
      );
    }
  }, [selectCounselCardAssistantInfo, setCounselAssistant, counselSessionId]);

  useEffect(() => {
    if (
      JSON.stringify(counselAssistant.healthInformation) !==
      JSON.stringify(formData)
    ) {
      setCounselAssistant({
        ...counselAssistant,
        healthInformation: formData,
      });
    }
  }, [formData, setCounselAssistant, counselAssistant]);

  // 업데이트 하는 함수
  const updateFormData = (
    section: keyof HealthInformationDTO,
    updates: Record<string, string | number | boolean>,
    isArrayUpdate: boolean = false,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(typeof prev[section] === 'object' ? prev[section] : {}),
        ...(isArrayUpdate
          ? {
              ...updates,
            }
          : {
              ...((prev[section] as SectionFields) ?? {}),
              ...updates,
            }),
      },
    }));
  };
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
  ]);

  // 입력값 함수
  const handleInput = (
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
    setFormData((prev) => {
      const currentValues =
        (prev[section] as SectionFields)?.[field] ?? ([] as string[]);

      return {
        ...prev,
        [section]: {
          ...(typeof prev[section] === 'object' ? prev[section] : {}),
          [field]: currentValues.includes(value)
            ? Array.isArray(currentValues)
              ? currentValues.filter((v) => v !== value)
              : []
            : [...currentValues, value],
        },
      };
    });
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
          {handleInput(
            '질병 및 수술 이력',
            '과거 질병 및 수술 이력을 작성해주세요.',
            'diseaseInfo',
            'historyNote',
          )}
          {handleInput(
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
          {handleInput(
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
          {handleInput(
            '부작용 의심 약물',
            '예: 항암제',
            'medicationSideEffect',
            'suspectedMedicationNote',
            formData.medicationSideEffect?.isSideEffect,
          )}
          {handleInput(
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
