import CardContainer from '@/components/common/CardContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/reduxHooks';
import { changeActiveTab } from '@/reducers/tabReducer';
import { useCounselAssistantStore } from '@/store/counselAssistantStore';
import {
  IswalkingTypes,
  walkingTools,
  evacuationMethods,
  sightTypes,
  hearingTypes,
  communicationTypes,
  usingKoreanTypes,
} from '@/pages/assistant/constants/IndependentInfo';
import {
  CommunicationDTO,
  EvacuationDTO,
  IndependentLifeInformationDTO,
  WalkingDTO,
} from '@/api';
import { useParams } from 'react-router-dom';
import { useSelectCounselCard } from '@/hooks/useCounselAssistantQuery';

const IndependentInfo = () => {
  // 새로고침이 되었을 때도 active tab 을 잃지 않도록 컴포넌트 load 시 dispatch
  const dispatch = useAppDispatch();
  const { counselSessionId } = useParams(); //useParams()를 통해 counselSessionId를 가져옴
  const { counselAssistant, setCounselAssistant } = useCounselAssistantStore();
  useEffect(() => {
    dispatch(changeActiveTab('/assistant/view/livingInfo')); // 해당 tab의 url
  }, [dispatch]);
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
  const handleOptionChange = (
    option: string,
    section: keyof IndependentLifeInformationDTO,
    field: keyof WalkingDTO | keyof EvacuationDTO | keyof CommunicationDTO,
  ) => {
    setFormData((prev) => {
      let current: string[] = [];
      if (
        section === 'walking' &&
        (field === 'walkingMethods' ||
          field === 'walkingEquipments' ||
          field === 'etcNote')
      ) {
        current = (prev.walking?.[field] ?? []) as string[];
      } else if (
        section === 'evacuation' &&
        (field === 'evacuationMethods' || field === 'etcNote')
      ) {
        current = (prev.evacuation?.[field] ?? []) as string[];
      } else if (
        section === 'communication' &&
        (field === 'sights' ||
          field === 'hearings' ||
          field === 'communications' ||
          field === 'usingKoreans')
      ) {
        current = (prev.communication?.[field] ?? []) as string[];
      }
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return {
        ...prev,
        [section]: {
          ...(typeof prev[section] === 'object' ? prev[section] : {}),
          [field]: updated,
        },
      };
    });
  };
  const handleInputChange = (
    section: 'walking' | 'evacuation' | 'communication',
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
    if (selectCounselCardAssistantInfo?.independentLifeInformation) {
      setFormData(selectCounselCardAssistantInfo.independentLifeInformation);
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
  return (
    <>
      <TabContentContainer>
        {/* 보행 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'보행'} variant="error" itemName="baseInfo">
            {/* 보행 여부 */}
            <div className="inline-block p-4">
              <Label htmlFor="walking" className="font-bold">
                보행여부
              </Label>
              <p className="mt-3 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>
              <div className="flex gap-2">
                {IswalkingTypes.map((walking) => (
                  <Button
                    key={walking}
                    id="walking"
                    type="button"
                    variant={
                      formData.walking?.walkingMethods?.includes(walking)
                        ? 'pressed'
                        : 'nonpressed'
                    }
                    className="pl-2 pr-2 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(walking, 'walking', 'walkingMethods')
                    }>
                    {walking}
                  </Button>
                ))}
              </div>
            </div>

            {/* 이동 장비 */}
            <div className="p-4">
              <Label htmlFor="tools" className="font-bold">
                이동장비
              </Label>
              <p className="mt-3 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>
              <div className="flex gap-2">
                {walkingTools.map((tool) => (
                  <Button
                    key={tool}
                    id="tools"
                    type="button"
                    variant={
                      formData.walking?.walkingEquipments?.includes(tool)
                        ? 'pressed'
                        : 'nonpressed'
                    }
                    className="pl-2 pr-2 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(tool, 'walking', 'walkingEquipments')
                    }>
                    {tool}
                  </Button>
                ))}
              </div>
            </div>

            {/* 기타 */}
            {formData.walking?.walkingEquipments?.includes('기타') && (
              <div className="p-4 mb-6">
                <Label htmlFor="etcNote" className="font-bold">
                  기타
                </Label>
                <Input
                  id="etcNote"
                  name="etcNote"
                  placeholder="‘기타' 선택시, 이동 장비를 작성해주세요."
                  value={formData.walking?.etcNote || ''}
                  onChange={(e) => handleInputChange('walking', e)}
                  className="mt-3 "
                />
              </div>
            )}
          </CardContainer>
        </div>

        {/* 배변 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'배변'} itemName="baseInfo">
            {/* 배변 처리 방식 */}
            <div className="w-full p-4">
              <Label htmlFor="evacuationMethods" className="font-bold">
                배변 처리 방식
              </Label>
              <p className="mt-3 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>

              <div className="flex gap-2">
                {evacuationMethods.map((evacuation) => (
                  <Button
                    key={evacuation}
                    id="evacuation"
                    type="button"
                    variant={
                      formData.evacuation?.evacuationMethods?.includes(
                        evacuation,
                      )
                        ? 'pressed'
                        : 'nonpressed'
                    }
                    className="pl-2 pr-2 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(
                        evacuation,
                        'evacuation',
                        'evacuationMethods',
                      )
                    }>
                    {evacuation}
                  </Button>
                ))}
              </div>
            </div>

            {/* 기타 */}
            {formData.evacuation?.evacuationMethods?.includes('기타') && (
              <div className="p-4 mb-6">
                <Label htmlFor="etcNote" className="font-bold">
                  기타
                </Label>
                <Input
                  id="etcNote"
                  name="etcNote"
                  placeholder="‘기타' 선택시, 배변 처리 방식을 작성해주세요."
                  value={formData.evacuation?.etcNote || ''}
                  onChange={(e) => handleInputChange('evacuation', e)}
                  className="mt-3 "
                />
              </div>
            )}
          </CardContainer>
        </div>

        {/* 의사소통 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'의사소통 정도'} itemName="baseInfo">
            {/* 시력 */}
            <div className="w-full p-4">
              <Label htmlFor="sight" className="font-bold">
                시력
              </Label>
              <p className="mt-3 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>
              <div className="flex gap-2">
                {sightTypes.map((sight) => (
                  <Button
                    key={sight}
                    id="sight"
                    type="button"
                    variant={
                      formData.communication?.sights?.includes(sight)
                        ? 'pressed'
                        : 'nonpressed'
                    }
                    className="pl-2 pr-2 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(sight, 'communication', 'sights')
                    }>
                    {sight}
                  </Button>
                ))}
              </div>
            </div>

            {/* 청력 */}
            <div className="w-full p-4">
              <Label htmlFor="hearing" className="font-bold">
                청력
              </Label>
              <p className="mt-3 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>
              <div className="flex gap-2">
                {hearingTypes.map((hearing) => (
                  <Button
                    key={hearing}
                    id="hearing"
                    type="button"
                    variant={
                      formData.communication?.hearings?.includes(hearing)
                        ? 'pressed'
                        : 'nonpressed'
                    }
                    className="pl-2 pr-2 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(hearing, 'communication', 'hearings')
                    }>
                    {hearing}
                  </Button>
                ))}
              </div>
            </div>

            {/* 언어 소통 */}
            <div className="w-full p-4">
              <Label htmlFor="communication" className="font-bold">
                언어 소통
              </Label>
              <p className="mt-3 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>
              <div className="flex gap-2">
                {communicationTypes.map((communication) => (
                  <Button
                    key={communication}
                    id="communication"
                    type="button"
                    variant={
                      formData.communication?.communications?.includes(
                        communication,
                      )
                        ? 'pressed'
                        : 'nonpressed'
                    }
                    className="pl-2 pr-2 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(
                        communication,
                        'communication',
                        'communications',
                      )
                    }>
                    {communication}
                  </Button>
                ))}
              </div>
            </div>

            {/* 한글 사용 */}
            <div className="w-full p-4">
              <Label htmlFor="useKorean" className="font-bold">
                한글 사용
              </Label>
              <p className="mt-3 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>
              <div className="flex gap-2">
                {usingKoreanTypes.map((useKorean) => (
                  <Button
                    key={useKorean}
                    id="useKorean"
                    type="button"
                    variant={
                      formData.communication?.usingKoreans?.includes(useKorean)
                        ? 'pressed'
                        : 'nonpressed'
                    }
                    className="pl-2 pr-2 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(
                        useKorean,
                        'communication',
                        'usingKoreans',
                      )
                    }>
                    {useKorean}
                  </Button>
                ))}
              </div>
            </div>
          </CardContainer>
        </div>
      </TabContentContainer>
    </>
  );
};
export default IndependentInfo;
