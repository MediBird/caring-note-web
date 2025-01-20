import Badge from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TabContentContainer from '@/components/consult/TabContentContainer';
import InfoBlueIcon from '@/assets/icon/24/info.filled.blue.svg';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/reduxHooks';
import CardContainer from '@/components/common/CardContainer';
import { changeActiveTab } from '@/reducers/tabReducer';
import { useCounselAssistantStore } from '@/store/counselAssistantStore';
import { BaseInformationDTO } from '@/api';
import {
  insuranceTypes,
  consultationCounts,
  consultationGoals,
} from '@/pages/assistant/constants/baseInfo';
import { useParams } from 'react-router-dom';
import { useSelectCounselCard } from '@/hooks/useCounselAssistantQuery';

const BaseInfo = () => {
  // 새로고침이 되었을 때도 active tab 을 잃지 않도록 컴포넌트 load 시 dispatch
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(changeActiveTab('/assistant/view/basicInfo')); // 해당 tab의 url
  }, [dispatch]);
  const { counselSessionId } = useParams(); //useParams()를 통해 counselSessionId를 가져옴

  const { counselAssistant, setCounselAssistant } = useCounselAssistantStore();
  // 상담 카드 조회
  const { data: selectCounselCardAssistantInfo } = useSelectCounselCard(
    counselSessionId ?? '',
  );
  const [formData, setFormData] = useState<BaseInformationDTO>(
    counselAssistant.baseInformation || {
      baseInfo: {},
      counselPurposeAndNote: {},
    }, //counselAssistant.baseInformation이 null이면 빈 객체를 넣어줌),
  );

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      counselPurposeAndNote: {
        ...prev.counselPurposeAndNote,
        counselPurpose: prev.counselPurposeAndNote?.counselPurpose?.includes(
          goal,
        )
          ? prev.counselPurposeAndNote.counselPurpose.filter(
              (item) => item !== goal,
            )
          : [...(prev.counselPurposeAndNote?.counselPurpose || []), goal],
      },
    }));
  };

  const handleInputChange = (
    section: 'baseInfo' | 'counselPurposeAndNote',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [e.target.name]: e.target.value,
      },
    }));
  };

  useEffect(() => {
    if (selectCounselCardAssistantInfo?.baseInformation) {
      setFormData(selectCounselCardAssistantInfo.baseInformation);
    }
  }, [selectCounselCardAssistantInfo, setCounselAssistant, counselSessionId]);

  // `formData`가 변경되었을 때 `counselAssistant` 업데이트
  useEffect(() => {
    if (
      JSON.stringify(counselAssistant.baseInformation) !==
      JSON.stringify(formData)
    ) {
      setCounselAssistant({
        ...counselAssistant,
        baseInformation: formData,
      });
    }
  }, [formData, setCounselAssistant, counselAssistant]);
  return (
    <>
      <TabContentContainer>
        <div className="flex items-center justify-between">
          <Badge
            variant="tint"
            color="primary"
            className="mt-2 mb-6 bg-primary-5"
            customIcon={<img src={InfoBlueIcon} />}>
            이전 상담 노트에서 불러온 정보를 토대로 손쉽게 작성해보세요.
          </Badge>
        </div>

        {/* 박진완 : CardContainer 리팩토링 완료! 사용법은 ConsultCard.tsx 를 참고하시면 편해용 */}
        <div className="flex items-start justify-between space-x-4">
          {/* 기본정보 입력 */}
          <CardContainer
            title={'기본정보'}
            variant="grayscale"
            itemName="baseInfo">
            {/* 성명 */}
            <div className="inline-block w-1/4 p-4">
              <Label htmlFor="name" className="font-bold">
                성명
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="이름"
                value={formData.baseInfo?.name || ''}
                onChange={(e) => handleInputChange('baseInfo', e)}
                className="mt-3"
              />
            </div>

            {/* 생년월일 */}
            <div className="inline-block w-1/4 p-4">
              <Label htmlFor="birthDate" className="font-bold">
                생년월일
              </Label>
              <Input
                id="birthDate"
                name="birthDate"
                placeholder="YYYY-MM-DD"
                value={formData.baseInfo?.birthDate || ''}
                onChange={(e) => handleInputChange('baseInfo', e)}
                className="mt-3"
              />
            </div>

            {/* 의료보장형태 */}
            <div className="p-4">
              <Label htmlFor="insuranceType" className="font-bold">
                의료보장형태
              </Label>
              <div className="flex gap-2">
                {insuranceTypes.map((type) => (
                  <Button
                    key={type.value}
                    id="insuranceType"
                    type="button"
                    variant={
                      formData.baseInfo?.healthInsuranceType === type.value
                        ? 'pressed'
                        : 'nonpressed'
                    }
                    className="pl-2 pr-2 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        baseInfo: {
                          ...formData.baseInfo,
                          healthInsuranceType: type.value,
                        },
                      })
                    }>
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 상담차수  */}
            <div className="p-4">
              <Label htmlFor="consultationCount" className="font-bold">
                상담차수
              </Label>
              <div className="flex gap-2">
                {consultationCounts.map((count) => (
                  <Button
                    key={count}
                    id="consultationCount"
                    type="button"
                    variant={
                      formData.baseInfo?.counselSessionOrder === count
                        ? 'pressed'
                        : 'nonpressed'
                    }
                    className="pl-2 pr-2 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        baseInfo: {
                          ...formData.baseInfo,
                          counselSessionOrder: count,
                        },
                      })
                    }>
                    {count}
                  </Button>
                ))}
              </div>
            </div>

            {/* 최근 상담일 */}
            <div className="w-1/4 p-4">
              <Label htmlFor="lastCounselDate" className="font-bold">
                최근 상담일
              </Label>
              <Input
                id="lastCounselDate"
                name="lastCounselDate"
                placeholder="YYYY-MM-DD"
                value={formData.baseInfo?.lastCounselDate || ''}
                onChange={(e) => handleInputChange('baseInfo', e)}
                className="mt-3"
              />
            </div>
          </CardContainer>
        </div>

        {/* 상담 목적 및 특이사항 */}
        <div className="flex items-start justify-between space-x-4 ">
          <CardContainer title={'상담 목적 및 특이사항'} itemName="baseInfo">
            {/* 상담 목적 */}
            <div className="inline-block p-4">
              <Label htmlFor="goal" className="font-bold">
                상담 목적
              </Label>
              <p className="mt-1 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>
              <div className="flex gap-2">
                {consultationGoals.map((goal) => (
                  <Button
                    key={goal}
                    id="goal"
                    type="button"
                    variant={
                      formData.counselPurposeAndNote?.counselPurpose?.includes(
                        goal,
                      )
                        ? 'pressed'
                        : 'nonpressed'
                    }
                    className="pl-2 pr-2 font-medium rounded-lg"
                    size="lg"
                    onClick={() => toggleGoal(goal)}>
                    {goal}
                  </Button>
                ))}
              </div>
            </div>

            {/* 특이사항 */}
            <div className="p-4">
              <Label htmlFor="SignificantNote" className="font-bold">
                특이사항
              </Label>
              <Input
                id="SignificantNote"
                name="SignificantNote"
                placeholder="특이사항 혹은 약사에게 궁금한 점을 작성해주세요."
                value={formData.counselPurposeAndNote?.SignificantNote || ''}
                onChange={(e) => handleInputChange('counselPurposeAndNote', e)}
                className="pt-5 mt-3 pb-36"
              />
            </div>

            {/* 의약물 */}
            <div className="p-4">
              <Label htmlFor="MedicationNote" className="font-bold">
                의약물
              </Label>
              <Input
                id="MedicationNote"
                name="MedicationNote"
                placeholder="약사님께 전달해 드릴 의약물을 작성해 주세요."
                value={formData.counselPurposeAndNote?.MedicationNote || ''}
                onChange={(e) => handleInputChange('counselPurposeAndNote', e)}
                className="pt-5 mt-3 pb-36"
              />
            </div>
          </CardContainer>
        </div>
      </TabContentContainer>
    </>
  );
};
export default BaseInfo;
