import CardContainer from '@/components/common/CardContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { useCallback, useMemo } from 'react';
import { useCounselSurveyStore } from '@/pages/Survey/store/surveyInfoStore';
import {
  IswalkingTypes,
  walkingTools,
  evacuationMethods,
  sightTypes,
  hearingTypes,
  communicationTypes,
  usingKoreanTypes,
} from '@/pages/Survey/constants/IndependentInfo';
import { IndependentLifeInformationDTO } from '@/api';

type SectionFields = Record<string, string | undefined>;
type ButtonOption = {
  label: string;
  value: string | number | boolean;
};

const IndependentInfo = () => {
  //counselAssistantStore에서 counselAssistant와 setCounselAssistant를 가져옴
  const { counselSurvey, setCounselSurvey } = useCounselSurveyStore();

  // `useMemo`를 사용하여 `formData`가 불필요하게 재생성되지 않도록 최적화
  const formData = useMemo(
    () => ({
      ...counselSurvey.independentLifeInformation,
      version: '1.1',
      walking: counselSurvey.independentLifeInformation?.walking || {},
      evacuation: counselSurvey.independentLifeInformation?.evacuation || {},
      communication:
        counselSurvey.independentLifeInformation?.communication || {},
    }),
    [counselSurvey.independentLifeInformation],
  );

  // `useCallback`으로 `updateFormData` 메모이제이션 (의존성 배열 변화 방지)
  const updateFormData = useCallback(
    (
      section: keyof IndependentLifeInformationDTO,
      updates: Record<string, string | number | boolean>,
    ) => {
      setCounselSurvey((prevState) => ({
        ...prevState,
        independentLifeInformation: {
          ...prevState.independentLifeInformation,
          [section]: {
            ...(typeof prevState.independentLifeInformation?.[section] ===
              'object' &&
            prevState.independentLifeInformation?.[section] !== null
              ? prevState.independentLifeInformation?.[section]
              : {}),
            ...updates,
          },
        },
      }));
    },
    [setCounselSurvey],
  );

  // 입력값 변경 핸들러
  const handleInputChange = (
    section: keyof IndependentLifeInformationDTO,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateFormData(section, { [e.target.name]: e.target.value });
  };

  // 다중 선택 버튼 토글 함수
  const toggleArrayValue = (
    section: keyof IndependentLifeInformationDTO,
    field: string,
    value: string,
  ) => {
    setCounselSurvey((prevState) => {
      // `section`을 안전하게 가져오기 (초기값을 빈 객체로 설정)
      const sectionData = prevState.independentLifeInformation?.[section] ?? {};

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
        independentLifeInformation: {
          ...prevState.independentLifeInformation,
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

  // 다중 선택 버튼 렌더링 함수
  const renderMultiSelectButtons = (
    label: string,
    options: ButtonOption[],
    section: keyof IndependentLifeInformationDTO,
    field: string,
    extraFieldName?: string, // '기타' 입력 필드 이름
    extraFieldPlaceholder?: string, // '기타' 입력 필드 placeholder
  ) => {
    const isEtcSelected =
      extraFieldName &&
      typeof formData[section] === 'object' &&
      (formData[section] as SectionFields)?.[field]?.includes('기타'); // '기타' 선택 여부 확인

    return (
      <div className="p-4">
        <Label htmlFor={field} className="font-bold ">
          {label}
        </Label>
        <p className="mt-1 text-sm text-gray-500">
          여러개를 동시에 선택할 수 있어요.
        </p>
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
              className="pl-3 pr-3 mt-3 mr-3 font-medium rounded-lg"
              size="lg"
              onClick={() =>
                toggleArrayValue(section, field, option.value.toString())
              }>
              {option.label}
            </Button>
          ))}
        </div>
        {/* '기타' 선택 시 입력 필드 표시 */}
        {isEtcSelected && extraFieldName && (
          <div className="pt-4 mb-6">
            <Label htmlFor={extraFieldName} className="font-bold">
              기타
            </Label>
            <Input
              id={extraFieldName}
              name={extraFieldName}
              placeholder={extraFieldPlaceholder}
              value={
                (formData[section] as SectionFields)?.[extraFieldName] || ''
              }
              onChange={(e) => handleInputChange(section, e)}
              className="mt-3"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <TabContentContainer>
        {/* 보행 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer
            title={'보행'}
            variant="error"
            itemName="baseInfo"
            className="py-7">
            {/* 보행 여부 */}
            {renderMultiSelectButtons(
              '보행 여부',
              IswalkingTypes,
              'walking',
              'walkingMethods',
            )}

            {/* 이동 장비 */}
            {renderMultiSelectButtons(
              '이동 장비',
              walkingTools,
              'walking',
              'walkingEquipments',
              'etcNote',
              '기타 선택시, 이동 장비를 작성해주세요.',
            )}
          </CardContainer>
        </div>

        {/* 배변 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'배변'} itemName="baseInfo" className="py-7">
            {/* 배변 처리 방식 */}
            {renderMultiSelectButtons(
              '배변 처리 방식',
              evacuationMethods,
              'evacuation',
              'evacuationMethods',
              'etcNote',
              '기타 선택시, 배변 처리 방식을 작성해주세요.',
            )}
          </CardContainer>
        </div>

        {/* 의사소통 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer
            title={'의사소통 정도'}
            itemName="baseInfo"
            className="py-7">
            {/* 시력 */}
            {renderMultiSelectButtons(
              '시력',
              sightTypes,
              'communication',
              'sights',
            )}

            {/* 청력 */}
            {renderMultiSelectButtons(
              '청력',
              hearingTypes,
              'communication',
              'hearings',
            )}

            {/* 언어 소통 */}
            {renderMultiSelectButtons(
              '언어 소통',
              communicationTypes,
              'communication',
              'communications',
            )}

            {/* 한글 사용 */}
            {renderMultiSelectButtons(
              '한글 사용',
              usingKoreanTypes,
              'communication',
              'usingKoreans',
            )}
          </CardContainer>
        </div>
      </TabContentContainer>
    </>
  );
};
export default IndependentInfo;
