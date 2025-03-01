import { BaseInfoDTOHealthInsuranceTypeEnum } from '@/api/api';
import InfoBlueIcon from '@/assets/icon/24/info.filled.blue.svg';
import Badge from '@/components/common/Badge';
import CardContainer from '@/components/common/CardContainer';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/function/formatDate';
import { useSelectCounseleeInfo } from '@/hooks/useCounseleeQuery';
import { useSelectPreviousCounselSessionList } from '@/hooks/useCounselSessionQuery';
import {
  consultationCounts,
  consultationGoals,
  insuranceTypes,
} from '@/pages/Survey/constants/baseInfo';
import { useSelectCounselCard } from '@/pages/Survey/hooks/useCounselAssistantQuery';
import { useCounselSurveyStore } from '@/pages/Survey/store/surveyInfoStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const BaseInfo = () => {
  //useParams()를 통해 counselSessionId를 가져옴
  const { counselSessionId } = useParams();
  // counselAssistantStore에서 counselAssistant와 setCounselAssistant를 가져옴
  const { counselSurvey, setCounselSurvey } = useCounselSurveyStore();
  // 상담 카드 조회
  const { data: selectCounselCardAssistantInfo } = useSelectCounselCard(
    counselSessionId ?? '',
  );
  // 내담자 기본 정보 조회
  const { data: counseleeBasicInfo } = useSelectCounseleeInfo(
    counselSessionId ?? '',
  );
  // 이전 상담 내역 조회
  const { data: previousCounselSessionList } =
    useSelectPreviousCounselSessionList(counselSessionId ?? '');

  // 상태 타입 정의
  interface FormData {
    baseInfo: {
      name: string;
      birthDate: string;
      counselSessionOrder: string;
      lastCounselDate: string;
      healthInsuranceType: BaseInfoDTOHealthInsuranceTypeEnum | undefined;
    };
    counselPurposeAndNote: {
      SignificantNote: string;
      MedicationNote: string;
      counselPurpose: string[];
    };
  }
  // 상태 관리
  const [formData, setFormData] = useState<FormData>({
    baseInfo: {
      name: '',
      birthDate: '',
      healthInsuranceType: undefined,
      counselSessionOrder: '',
      lastCounselDate: '',
    },
    counselPurposeAndNote: {
      SignificantNote: '',
      MedicationNote: '',
      counselPurpose: [],
    },
  });
  // 초기값 설정이 한 번만 실행되도록 하는 ref
  const hasInitialized = useRef(false);

  // 초기값 설정: counselSurvey.baseInformation을 의존성 배열에 포함시키되, 최초 실행 후에는 업데이트되지 않도록 함.
  useEffect(() => {
    if (
      counseleeBasicInfo &&
      previousCounselSessionList &&
      !hasInitialized.current
    ) {
      if (
        counselSurvey.baseInformation &&
        counselSurvey.baseInformation.baseInfo?.name !== ''
      ) {
        setFormData({
          baseInfo: {
            name: counselSurvey.baseInformation.baseInfo?.name || '',
            birthDate: counselSurvey.baseInformation.baseInfo?.birthDate || '',
            counselSessionOrder:
              counselSurvey.baseInformation.baseInfo?.counselSessionOrder || '',
            lastCounselDate:
              counselSurvey.baseInformation.baseInfo?.lastCounselDate || '',
            healthInsuranceType:
              counselSurvey.baseInformation.baseInfo?.healthInsuranceType,
          },
          counselPurposeAndNote: {
            SignificantNote:
              counselSurvey.baseInformation.counselPurposeAndNote
                ?.SignificantNote || '',
            MedicationNote:
              counselSurvey.baseInformation.counselPurposeAndNote
                ?.MedicationNote || '',
            counselPurpose:
              counselSurvey.baseInformation.counselPurposeAndNote
                ?.counselPurpose || [],
          },
        });
      } else {
        // 서버 데이터 기반으로 초기값 설정
        const mergedData: FormData = {
          baseInfo: {
            name: counseleeBasicInfo.name || '',
            birthDate: counseleeBasicInfo.dateOfBirth || '',
            counselSessionOrder:
              previousCounselSessionList[0]?.CounselSessionOrder !== ''
                ? '재상담'
                : '초기상담',
            lastCounselDate:
              previousCounselSessionList[0]?.counselSessionDate || '',
            healthInsuranceType: undefined,
          },
          counselPurposeAndNote: {
            SignificantNote: '',
            MedicationNote: '',
            counselPurpose: [],
          },
        };
        setFormData(mergedData);
      }
      // 최초 초기화 완료 후, 플래그를 true로 변경
      hasInitialized.current = true;
    }
  }, [
    counseleeBasicInfo,
    previousCounselSessionList,
    counselSurvey.baseInformation,
  ]);

  // 외부 상태 동기화: 로컬 상태(formData)가 변경될 때마다 외부 상태 업데이트 (렌더링 후 실행)
  useEffect(() => {
    setCounselSurvey((prevState) => ({
      ...prevState,
      baseInformation: formData,
    }));
  }, [formData, setCounselSurvey]);

  // 상태 업데이트 함수: 로컬 상태 업데이트만 처리
  const updateFormData = useCallback(
    <T extends keyof FormData>(
      section: T,
      field: keyof FormData[T],
      value: string | string[] | number | boolean,
    ) => {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    },
    [],
  );
  // 입력 필드 렌더링 함수
  const renderInput = (
    label: string,
    field: keyof FormData['baseInfo'],
    placeholder: string,
  ) => {
    // onChange 이벤트 핸들러 수정
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let { value } = e.target;
      // 생년월일 또는 최근상담일 필드라면 날짜 포맷팅 적용
      if (field === 'birthDate' || field === 'lastCounselDate') {
        value = formatDate(value);
      }
      updateFormData('baseInfo', field, value);
    };

    return (
      <div className="inline-block w-1/2 p-4">
        <Label htmlFor={field} className="font-bold">
          {label}
        </Label>
        <Input
          id={field}
          name={field}
          placeholder={placeholder}
          value={formData.baseInfo?.[field] || ''}
          onChange={handleChange}
          className="mt-3"
        />
      </div>
    );
  };

  // 버튼 렌더링 함수
  const renderButtons = (
    label: string,
    options: { label: string; value: string }[],
    field: keyof typeof formData.baseInfo,
  ) => (
    <div className="p-4">
      <Label className="font-bold">{label}</Label>
      <div className="flex gap-2">
        {options.map((option) => (
          <Button
            key={option.label}
            type="button"
            variant={
              formData.baseInfo?.[field] === option.value
                ? 'pressed'
                : 'nonpressed'
            }
            className="pl-3 pr-3 mt-3 font-medium rounded-lg"
            size="lg"
            onClick={() => updateFormData('baseInfo', field, option.value)}>
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );

  // 다중 선택 버튼 (상담 목적)
  const renderMultiSelectButtons = (
    label: string,
    options: { label: string; value: string }[],
    field: keyof typeof formData.counselPurposeAndNote,
  ) => (
    <div className="p-4">
      <Label className="font-bold">{label}</Label>
      <p className="mt-3 mb-3 text-sm text-gray-500">
        여러 개를 동시에 선택할 수 있어요.
      </p>
      <div className="flex gap-2">
        {options.map((option) => (
          <Button
            key={option.label}
            type="button"
            variant={
              (formData.counselPurposeAndNote?.[field] as string[])?.includes(
                option.value,
              )
                ? 'pressed'
                : 'nonpressed'
            }
            className="pl-3 pr-3 mt-3 font-medium rounded-lg"
            size="lg"
            onClick={() => {
              const updatedGoals = formData.counselPurposeAndNote[
                field
              ].includes(option.value)
                ? (Array.isArray(formData.counselPurposeAndNote[field])
                    ? formData.counselPurposeAndNote[field]
                    : []
                  ).filter((v: string) => v !== option.value)
                : [...formData.counselPurposeAndNote[field], option.value];
              console.log(updatedGoals);

              updateFormData('counselPurposeAndNote', field, updatedGoals);
            }}>
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );

  // ✅ 텍스트 입력 필드 (Textarea)
  const renderTextarea = (
    label: string,
    field: keyof typeof formData.counselPurposeAndNote,
    placeholder: string,
  ) => (
    <div className="p-4">
      <Label className="font-bold">{label}</Label>
      <Textarea
        placeholder={placeholder}
        value={formData.counselPurposeAndNote?.[field] || ''}
        onChange={(e) =>
          updateFormData('counselPurposeAndNote', field, e.target.value)
        }
        className="mt-3 pb-36"
      />
    </div>
  );

  return (
    <TabContentContainer>
      {/* 배지 안내 메시지 */}
      {selectCounselCardAssistantInfo?.status === 200 && (
        <Badge
          variant="tint"
          color="primary"
          className="mt-2 mb-6 bg-primary-5"
          customIcon={<img src={InfoBlueIcon} />}>
          이전 상담 노트에서 불러온 정보를 토대로 손쉽게 작성해보세요.
        </Badge>
      )}

      {/* 기본 정보 카드 */}
      <CardContainer
        title="기본정보"
        variant="grayscale"
        itemName="baseInfo"
        className="py-7">
        {/* 이름 입력 */}
        {renderInput('성명', 'name', '이름을 입력해주세요.')}
        {/* 생년월일 입력 */}
        {renderInput(
          '생년월일',
          'birthDate',
          'YYYY-MM-DD 형식으로 입력해주세요.',
        )}
        {/* 의료보장형태 선택 */}
        {renderButtons('의료보장형태', insuranceTypes, 'healthInsuranceType')}
        {/* 상담 경험 선택 */}
        {renderButtons('상담 경험', consultationCounts, 'counselSessionOrder')}
        {/* 최근 상담일 입력 */}
        {renderInput(
          '최근 상담일',
          'lastCounselDate',
          'YYYY-MM-DD 형식으로 입력해주세요.',
        )}
      </CardContainer>

      {/* 상담 목적 및 특이사항 */}
      <CardContainer
        title="상담 목적 및 특이사항"
        className="py-7"
        itemName="baseInfo">
        {/* 상담 목적 다중 선택 */}
        {renderMultiSelectButtons(
          '상담 목적',
          consultationGoals,
          'counselPurpose',
        )}
        {/* 특이사항 입력 */}
        {renderTextarea(
          '특이사항',
          'SignificantNote',
          '상담사님께 전달할 특이사항을 작성해 주세요.',
        )}
        {/* 복용 중인 의약품 입력 */}
        {renderTextarea(
          '의약물',
          'MedicationNote',
          '복용 중인 의약품을 작성해 주세요.',
        )}
      </CardContainer>
    </TabContentContainer>
  );
};

export default BaseInfo;
