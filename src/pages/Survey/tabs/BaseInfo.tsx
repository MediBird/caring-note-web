import Badge from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TabContentContainer from '@/components/consult/TabContentContainer';
import InfoBlueIcon from '@/assets/icon/24/info.filled.blue.svg';
import { useCallback, useMemo } from 'react';
import CardContainer from '@/components/common/CardContainer';
import { useCounselSurveyStore } from '@/pages/Survey/store/surveyInfoStore';
import { BaseInformationDTO } from '@/api';
import {
  insuranceTypes,
  consultationCounts,
  consultationGoals,
} from '@/pages/Survey/constants/baseInfo';
import { useParams } from 'react-router-dom';
import { useSelectCounselCard } from '@/pages/Survey/hooks/useCounselAssistantQuery';
import { Textarea } from '@/components/ui/textarea';

type SectionFields = Record<string, string | undefined>;
type ButtonOption = {
  label: string;
  value: string | number | boolean;
};
const BaseInfo = () => {
  //useParams()를 통해 counselSessionId를 가져옴
  const { counselSessionId } = useParams();
  // counselAssistantStore에서 counselAssistant와 setCounselAssistant를 가져옴
  const { counselSurvey, setCounselSurvey } = useCounselSurveyStore();
  // 상담 카드 조회
  const { data: selectCounselCardAssistantInfo } = useSelectCounselCard(
    counselSessionId ?? '',
  );
  // `useMemo`를 사용하여 `formData`가 불필요하게 재생성되지 않도록 최적화
  const formData = useMemo(
    () => ({
      ...counselSurvey.baseInformation,
      version: '1.1',
      baseInfo: counselSurvey.baseInformation?.baseInfo || {},
      counselPurposeAndNote:
        counselSurvey.baseInformation?.counselPurposeAndNote || {},
    }),
    [counselSurvey.baseInformation],
  );

  // `useCallback`으로 `updateFormData` 메모이제이션 (의존성 배열 변화 방지)
  const updateFormData = useCallback(
    (
      section: keyof BaseInformationDTO,
      updates: Record<string, string | number | boolean>,
    ) => {
      setCounselSurvey((prevState) => ({
        ...prevState,
        baseInformation: {
          ...prevState.baseInformation,
          [section]: {
            ...(typeof prevState.baseInformation?.[section] === 'object' &&
            prevState.baseInformation?.[section] !== null
              ? prevState.baseInformation?.[section]
              : {}),
            ...updates,
          },
        },
      }));
    },
    [setCounselSurvey],
  );

  // 입력값 함수
  const handleInput = (
    label: string,
    placeholder: string,
    section: keyof BaseInformationDTO,
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

  // 입력값 함수
  const handleTextarea = (
    label: string,
    placeholder: string,
    section: keyof BaseInformationDTO,
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
    section: keyof BaseInformationDTO,
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
    section: keyof BaseInformationDTO,
    field: string,
    value: string,
  ) => {
    setCounselSurvey((prevState) => {
      // `section`을 안전하게 가져오기 (초기값을 빈 객체로 설정)
      const sectionData = prevState.baseInformation?.[section] ?? {};

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
        baseInformation: {
          ...prevState.baseInformation,
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
    section: keyof BaseInformationDTO,
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
        {selectCounselCardAssistantInfo?.status === 200 && (
          <div className="flex items-center justify-between">
            <Badge
              variant="tint"
              color="primary"
              className="mt-2 mb-6 bg-primary-5"
              customIcon={<img src={InfoBlueIcon} />}>
              이전 상담 노트에서 불러온 정보를 토대로 손쉽게 작성해보세요.
            </Badge>
          </div>
        )}

        {/* 박진완 : CardContainer 리팩토링 완료! 사용법은 ConsultCard.tsx 를 참고하시면 편해용 */}
        <div className="flex items-start justify-between space-x-4">
          {/* 기본정보 입력 */}
          <CardContainer
            title={'기본정보'}
            variant="grayscale"
            itemName="baseInfo"
            className="py-7">
            {/* 성명 */}
            <div className="inline-block w-1/4">
              {handleInput('성명', '이름을 입력해주세요.', 'baseInfo', 'name')}
            </div>

            {/* 생년월일 */}
            <div className="inline-block w-1/4">
              {handleInput(
                '생년월일',
                'YYYY-MM-DD 형식으로 입력해주세요.',
                'baseInfo',
                'birthDate',
              )}
            </div>

            {/* 의료보장형태 */}
            {renderButtons(
              '의료보장형태',
              insuranceTypes,
              'baseInfo',
              'healthInsuranceType',
            )}

            {/* 상담경험  */}
            {renderButtons(
              '상담경험',
              consultationCounts,
              'baseInfo',
              'counselSessionOrder',
            )}

            {/* 최근 상담일 */}
            <div className="w-1/4">
              {handleInput(
                '최근 상담일',
                'YYYY-MM-DD 형식으로 입력해주세요.',
                'baseInfo',
                'lastCounselDate',
              )}
            </div>
          </CardContainer>
        </div>

        {/* 상담 목적 및 특이사항 */}
        <div className="flex items-start justify-between space-x-4 ">
          <CardContainer
            title={'상담 목적 및 특이사항'}
            className="py-7"
            itemName="baseInfo">
            {/* 상담 목적 */}
            {renderMultiSelectButtons(
              '상담 목적',
              consultationGoals,
              'counselPurposeAndNote',
              'counselPurpose',
            )}

            {/* 특이사항 */}
            {handleTextarea(
              '특이사항',
              '상담사님께 전달해 드릴 특이사항을 작성해 주세요.',
              'counselPurposeAndNote',
              'SignificantNote',
            )}

            {/* 의약물 */}
            {handleTextarea(
              '의약물',
              '복용 중인 의약품을 작성해 주세요.',
              'counselPurposeAndNote',
              'MedicationNote',
            )}
          </CardContainer>
        </div>
      </TabContentContainer>
    </>
  );
};
export default BaseInfo;
