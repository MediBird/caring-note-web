import { useAppDispatch } from '@/app/reduxHooks';
import CardContainer from '@/components/common/CardContainer';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changeActiveTab } from '@/reducers/tabReducer';
import { useEffect, useState } from 'react';

const isSmokingTypes = ['흡연', '비흡연'];
const smokingDailyCounts = ['1갑', '2갑', '3갑 이상'];
const isDrinkingTypes = ['음주', '비음주'];
const drkingWeeklyCounts = [
  '주 1회',
  '주 2회',
  '주 3회',
  '주 4회',
  '주 5회 이상',
];
const dailyEatingTypes = [
  '하루 한 끼 규칙적 식사',
  '하루 두끼 규칙적 식사',
  '하루 세끼 규칙적 식사',
  '불규칙적 식사',
];
const exerciseWeeklyCounts = [
  '주 1회',
  '주 2회',
  '주 3회',
  '주 4회',
  '주 5회 이상',
  '운동 안 함',
];
const livingWithType = ['독거', '동거'];
const medicinetakingMembers = [
  '본인',
  '배우자',
  '자녀',
  '친인척',
  '친구',
  '요양보호사 또는 돌봄종사자',
  '기타',
];
const LifeInfo = () => {
  // 새로고침이 되었을 때도 active tab 을 잃지 않도록 컴포넌트 load 시 dispatch
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(changeActiveTab('/assistant/view/lifeInfo')); // 해당 tab의 url
  }, [dispatch]);
  const [formData, setFormData] = useState({
    isSmoking: '흡연',
    smokingPeriod: '',
    smokingDailyCount: '1갑',
    isDrinking: '음주',
    drinkingWeeklyCount: '주 1회',
    dailyEatingType: '하루 한 끼 규칙적 식사',
    dailyEatingDetails: '',
    exerciseWeeklyCount: '주 1회',
    exerciseWeeklyDetails: '',
    isLivingwith: '독거',
    livingWithMember: '',
    members: [] as string[],
  });
  const toggleGoal = (member: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(member)
        ? prev.members.filter((g) => g !== member)
        : [...prev.members, member],
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <>
      <TabContentContainer>
        {/* 흡연 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'흡연'} variant="secondary">
            {/* 흡연 여부 */}
            <div className="inline-block w-1/4 p-4">
              <Label htmlFor="isSmoking" className="font-bold">
                흡연 여부
              </Label>
              <div className="flex gap-2">
                {isSmokingTypes.map((smoking) => (
                  <Button
                    key={smoking}
                    id="isSmoking"
                    type="button"
                    variant={
                      formData.isSmoking === smoking ? 'secondary' : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({ ...formData, isSmoking: smoking })
                    }>
                    {smoking}
                  </Button>
                ))}
              </div>
            </div>
            {/* 총 흡연기간 */}
            <div className="w-1/4 p-4">
              {formData.isSmoking === '흡연' && (
                <div className="mb-6">
                  <Label htmlFor="smokingPeriod" className="font-bold">
                    총 흡연기간
                  </Label>
                  <Input
                    id="smokingPeriod"
                    name="smokingPeriod"
                    placeholder="예: 10년 6개월"
                    value={formData.smokingPeriod}
                    onChange={handleInputChange}
                    className="mt-3"
                  />
                </div>
              )}
            </div>
            {/* 하루 평균 흡연량 */}
            <div className="p-4">
              {formData.isSmoking === '흡연' && (
                <div className="mb-6">
                  <Label htmlFor="smokingDailyCount" className="font-bold">
                    하루 평균 흡연량
                  </Label>
                  <div className="flex gap-2">
                    {smokingDailyCounts.map((count) => (
                      <Button
                        key={count}
                        id="smokingDailyCount"
                        type="button"
                        variant={
                          formData.smokingDailyCount === count
                            ? 'secondary'
                            : 'outline'
                        }
                        className="p-3 mt-3 font-medium rounded-lg"
                        size="lg"
                        onClick={() =>
                          setFormData({ ...formData, smokingDailyCount: count })
                        }>
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContainer>
        </div>

        {/* 음주 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'음주'}>
            {/* 음주 여부 */}
            <div className="inline-block w-1/4 p-4">
              <Label htmlFor="isDrinking" className="font-bold">
                음주 여부
              </Label>
              <div className="flex gap-2">
                {isDrinkingTypes.map((drinking) => (
                  <Button
                    key={drinking}
                    id="isDrinking"
                    type="button"
                    variant={
                      formData.isDrinking === drinking ? 'secondary' : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({ ...formData, isDrinking: drinking })
                    }>
                    {drinking}
                  </Button>
                ))}
              </div>
            </div>

            {/* 음주 횟수 */}
            <div className="p-4">
              {formData.isDrinking === '음주' && (
                <div className="mb-6">
                  <Label htmlFor="drinkingWeeklyCount" className="font-bold">
                    음주 횟수
                  </Label>
                  <div className="flex gap-2">
                    {drkingWeeklyCounts.map((count) => (
                      <Button
                        key={count}
                        id="drinkingWeeklyCount"
                        type="button"
                        variant={
                          formData.drinkingWeeklyCount === count
                            ? 'secondary'
                            : 'outline'
                        }
                        className="p-3 mt-3 font-medium rounded-lg"
                        size="lg"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            drinkingWeeklyCount: count,
                          })
                        }>
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContainer>
        </div>

        {/* 영양상태 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'영양상태'}>
            {/* 하루 식사 패턴 */}
            <div className="inline-block w-1/4 p-4">
              <Label htmlFor="isSmoking" className="font-bold">
                하루 식사 패턴
              </Label>
              <div className="flex gap-2">
                {dailyEatingTypes.map((type) => (
                  <Button
                    key={type}
                    id="dailyEatingType"
                    type="button"
                    variant={
                      formData.dailyEatingType === type
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({ ...formData, dailyEatingType: type })
                    }>
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* 식생활 특이사항 */}
            <div className="p-4">
              <Label htmlFor="dailyEatingDetails" className="font-bold">
                식생활 특이사항
              </Label>
              <Input
                id="dailyEatingDetails"
                name="dailyEatingDetails"
                placeholder="예:잇몸 문제로 딱딱한 음식 섭취 어려움"
                value={formData.dailyEatingDetails}
                onChange={handleInputChange}
                className="mt-3"
              />
            </div>
          </CardContainer>
        </div>

        {/* 운동 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'운동'}>
            {/* 주간 운동 패턴 */}
            <div className="inline-block w-1/4 p-4">
              <Label htmlFor="exerciseWeeklyCount" className="font-bold">
                주간 운동 패턴
              </Label>
              <div className="flex gap-2">
                {exerciseWeeklyCounts.map((count) => (
                  <Button
                    key={count}
                    id="exerciseWeeklyCount"
                    type="button"
                    variant={
                      formData.exerciseWeeklyCount === count
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({ ...formData, exerciseWeeklyCount: count })
                    }>
                    {count}
                  </Button>
                ))}
              </div>
            </div>

            {/* 규칙적으로 하는 운동 종류 */}
            <div className="w-1/4 p-4">
              {formData.exerciseWeeklyCount !== '운동 안 함' && (
                <div className="mb-6">
                  <Label htmlFor="exerciseWeeklyDetails" className="font-bold">
                    규칙적으로 하는 운동 종류
                  </Label>
                  <Input
                    id="exerciseWeeklyDetails"
                    name="exerciseWeeklyDetails"
                    placeholder="예: 산책, 수영"
                    value={formData.exerciseWeeklyDetails}
                    onChange={handleInputChange}
                    className="mt-3"
                  />
                </div>
              )}
            </div>
          </CardContainer>
        </div>

        {/* 약 복용 관리 입력 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'약 복용 관리'}>
            {/* 독거 여부 */}
            <div className="inline-block w-1/4 p-4">
              <Label htmlFor="isLivingwith" className="font-bold">
                독거 여부
              </Label>
              <div className="flex gap-2">
                {livingWithType.map((living) => (
                  <Button
                    key={living}
                    id="isLivingwith"
                    type="button"
                    variant={
                      formData.isLivingwith === living ? 'secondary' : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({ ...formData, isLivingwith: living })
                    }>
                    {living}
                  </Button>
                ))}
              </div>
            </div>
            {/* 동거인 구성원 */}
            <div className="w-1/4 p-4">
              {formData.isLivingwith === '동거' && (
                <div className="mb-6">
                  <Label htmlFor="livingWithMember" className="font-bold">
                    동거인 구성원
                  </Label>
                  <Input
                    id="livingWithMember"
                    name="livingWithMember"
                    placeholder="예: 손녀"
                    value={formData.livingWithMember}
                    onChange={handleInputChange}
                    className="mt-3"
                  />
                </div>
              )}
            </div>
            {/* 복용자 및 투약 보조자 */}
            <div className="p-4">
              <Label htmlFor="takingAssistant" className="font-bold">
                복용자 및 투약 보조자
              </Label>
              <p className="mt-3 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>
              <div className="flex gap-2">
                {medicinetakingMembers.map((member) => (
                  <Button
                    key={member}
                    id="takingAssistant"
                    type="button"
                    variant={
                      formData.members.includes(member)
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() => toggleGoal(member)}>
                    {member}
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
export default LifeInfo;
