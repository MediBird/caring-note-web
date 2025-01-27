import CardContainer from '@/components/common/CardContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { useEffect, useState } from 'react';
import { useCounselAssistantStore } from '@/pages/Survey/store/surveyInfoStore';
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
import { useParams } from 'react-router-dom';
import { useSelectCounselCard } from '@/pages/Survey/hooks/useCounselAssistantQuery';

type SectionFields = Record<string, string | undefined>;
type ButtonOption = {
  label: string;
  value: string | number | boolean;
};

const IndependentInfo = () => {
  //useParams()를 통해 counselSessionId를 가져옴
  const { counselSessionId } = useParams();
  //counselAssistantStore에서 counselAssistant와 setCounselAssistant를 가져옴
  const { counselAssistant, setCounselAssistant } = useCounselAssistantStore();

  // 상담 카드 조회
  const { data: selectCounselCardAssistantInfo } = useSelectCounselCard(
    counselSessionId ?? '',
  );
  const [formData, setFormData] = useState<IndependentLifeInformationDTO>(
    counselAssistant.independentLifeInformation || {
      walking: {},
      evacuation: {},
      communication: {},
    },
  );

  useEffect(() => {
    if (
      selectCounselCardAssistantInfo?.data?.data?.independentLifeInformation
    ) {
      setFormData(
        selectCounselCardAssistantInfo.data.data.independentLifeInformation,
      );
    }
  }, [selectCounselCardAssistantInfo, setCounselAssistant, counselSessionId]);

  // `formData`가 변경되었을 때 `counselAssistant` 업데이트
  useEffect(() => {
    if (
      JSON.stringify(counselAssistant.independentLifeInformation) !==
      JSON.stringify(formData)
    ) {
      setCounselAssistant({
        ...counselAssistant,
        independentLifeInformation: formData,
      });
    }
  }, [formData, setCounselAssistant, counselAssistant]);
  const handleInputChange = (
    section: keyof IndependentLifeInformationDTO,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as SectionFields),
        [e.target.name]: e.target.value,
      },
    }));
  };

  // 배열 값 토글 함수
  const toggleArrayValue = (
    section: keyof IndependentLifeInformationDTO,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => {
      const currentValues =
        (prev[section] as SectionFields)?.[field] || ([] as string[]);
      const updatedValues = currentValues.includes(value)
        ? Array.isArray(currentValues)
          ? currentValues.filter((v) => v !== value)
          : []
        : [...currentValues, value];
      return {
        ...prev,
        [section]: {
          ...(prev[section] as SectionFields),
          [field]: updatedValues,
          ...(value === '기타' &&
            !updatedValues.includes('기타') && { etcNote: '' }), // '기타' 해제 시 etcNote 초기화
        },
      };
    });
  };

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
