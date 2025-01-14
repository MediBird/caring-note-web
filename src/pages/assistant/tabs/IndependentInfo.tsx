import { useAppDispatch } from '@/app/reduxHooks';
import CardContainer from '@/components/common/CardContainer';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changeActiveTab } from '@/reducers/tabReducer';
import { useEffect, useState } from 'react';

type handleOptionChangeTypes =
  | 'selectedMobility'
  | 'selectedAbility'
  | 'selectedEvacuation'
  | 'selectedSight'
  | 'selectedHearing'
  | 'selectedCommunication'
  | 'selectedUsingKorean';

const IswalkingTypes = ['외상 및 보행불가', '자립보행 가능', '이동장비 필요'];
const walkingTools = ['지팡이', '워커', '휠체어', '기타'];
const evacuationMethods = [
  '자립 화장실 사용',
  '화장실 유도',
  '이동식 변기 사용',
  '기저귀 사용',
  '소변통 사용',
  '기타',
];
const sightTypes = ['잘 보임', '잘 안 보인', '안 보임', '안경 사용'];
const hearingTypes = ['잘 들림', '잘 안 들림', '안 들림', '보청기 사용'];
const communicationTypes = ['소통 가능함', '대강 가능함', '불가능'];
const usingKoreanTypes = ['읽기 가능', '쓰기 가능'];

const IndependentInfo = () => {
  // 새로고침이 되었을 때도 active tab 을 잃지 않도록 컴포넌트 load 시 dispatch
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(changeActiveTab('/assistant/view/livingInfo')); // 해당 tab의 url
  }, [dispatch]);
  const [formData, setFormData] = useState({
    selectedAbility: [] as string[],
    selectedMobility: [] as string[],
    selectedEvacuation: [] as string[],
    selectedSight: [] as string[],
    selectedHearing: [] as string[],
    selectedCommunication: [] as string[],
    selectedUsingKorean: [] as string[],
    equipInfo: '',
    evacuationDetails: '',
  });
  const handleOptionChange = (option: string, key: handleOptionChangeTypes) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(option)
        ? prev[key].filter((item) => item !== option)
        : [...prev[key], option],
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <>
      <TabContentContainer>
        {/* 보행 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'보행'} variant="error">
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
                      formData.selectedAbility.includes(walking)
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(walking, 'selectedAbility')
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
                      formData.selectedMobility.includes(tool)
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(tool, 'selectedMobility')
                    }>
                    {tool}
                  </Button>
                ))}
              </div>
            </div>

            {/* 기타 */}
            {formData.selectedMobility.includes('기타') && (
              <div className="p-4 mb-6">
                <Label htmlFor="equipInfo" className="font-bold">
                  기타
                </Label>
                <Input
                  id="equipInfo"
                  name="equipInfo"
                  placeholder="‘기타' 선택시, 이동 장비를 작성해주세요."
                  value={formData.equipInfo}
                  onChange={handleInputChange}
                  className="mt-3 "
                />
              </div>
            )}
          </CardContainer>
        </div>

        {/* 배변 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'배변'}>
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
                      formData.selectedEvacuation.includes(evacuation)
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(evacuation, 'selectedEvacuation')
                    }>
                    {evacuation}
                  </Button>
                ))}
              </div>
            </div>

            {/* 기타 */}
            {formData.selectedEvacuation.includes('기타') && (
              <div className="p-4 mb-6">
                <Label htmlFor="evacuationDetails" className="font-bold">
                  기타
                </Label>
                <Input
                  id="evacuationDetails"
                  name="evacuationDetails"
                  placeholder="‘기타' 선택시, 배변 처리 방식을 작성해주세요."
                  value={formData.evacuationDetails}
                  onChange={handleInputChange}
                  className="mt-3 "
                />
              </div>
            )}
          </CardContainer>
        </div>

        {/* 의사소통 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'의사소통 정도'}>
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
                      formData.selectedSight.includes(sight)
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() => handleOptionChange(sight, 'selectedSight')}>
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
                      formData.selectedHearing.includes(hearing)
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(hearing, 'selectedHearing')
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
                      formData.selectedCommunication.includes(communication)
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(communication, 'selectedCommunication')
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
                      formData.selectedUsingKorean.includes(useKorean)
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      handleOptionChange(useKorean, 'selectedUsingKorean')
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
