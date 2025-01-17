import CardContainer from '@/components/common/CardContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/reduxHooks';
import { changeActiveTab } from '@/reducers/tabReducer';
import { LivingInformationDTO } from '@/api';
import { useCounselAssistantStore } from '@/store/counselAssistantStore';
import {
  isAloneTypes,
  isDrinkingTypes,
  isSmokingTypes,
  medicinetakingMembers,
  smokingDailyCounts,
  drkingWeeklyCounts,
  dailyEatingTypes,
  exerciseWeeklyCounts,
} from '@/pages/assistant/constants/lifeInfo';

const LifeInfo = () => {
  // 새로고침이 되었을 때도 active tab 을 잃지 않도록 컴포넌트 load 시 dispatch
  const dispatch = useAppDispatch();
  const { counselAssistant, setCounselAssistant } = useCounselAssistantStore();
  useEffect(() => {
    dispatch(changeActiveTab('/assistant/view/lifeInfo')); // 해당 tab의 url
  }, [dispatch]);
  const [formData, setFormData] = useState<LivingInformationDTO>(
    counselAssistant.livingInformation || {
      smoking: {
        isSmoking: false,
        smokingAmount: '',
        smokingPeriodNote: '',
      },
      drinking: {
        isDrinking: false,
        drinkingAmount: '',
      },
      nutrition: {
        mealPattern: '',
        nutritionNote: '',
      },
      exercise: {
        exercisePattern: '',
        exerciseNote: '',
      },
      medicationManagement: {
        isAlone: false,
        houseMateNote: '',
        medicationAssistants: [],
      },
    },
  );

  const toggleGoal = (member: string) => {
    setFormData((prev) => ({
      ...prev,
      medicationManagement: {
        ...prev.medicationManagement,
        medicationAssistants:
          prev.medicationManagement?.medicationAssistants?.includes(member)
            ? prev.medicationManagement.medicationAssistants.filter(
                (item) => item !== member,
              )
            : [
                ...(prev.medicationManagement?.medicationAssistants || []),
                member,
              ],
      },
    }));
  };

  const handleInputChange = (
    section: 'smoking' | 'nutrition' | 'exercise' | 'medicationManagement',
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
    setCounselAssistant({
      ...counselAssistant,
      livingInformation: formData,
    });
  }, [formData, setCounselAssistant, counselAssistant]);

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
                    key={smoking.label}
                    id="isSmoking"
                    type="button"
                    variant={
                      formData.smoking?.isSmoking === smoking.value
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        smoking: {
                          ...formData.smoking,
                          isSmoking: smoking.value,
                        },
                      })
                    }>
                    {smoking.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* 총 흡연기간 */}
            <div className="w-1/4 p-4">
              {formData.smoking?.isSmoking == true && (
                <div className="mb-6">
                  <Label htmlFor="smokingPeriodNote" className="font-bold">
                    총 흡연기간
                  </Label>
                  <Input
                    id="smokingPeriodNote"
                    name="smokingPeriodNote"
                    placeholder="예: 10년 6개월"
                    value={formData.smoking?.smokingPeriodNote || ''}
                    onChange={(e) => handleInputChange('smoking', e)}
                    className="mt-3"
                  />
                </div>
              )}
            </div>
            {/* 하루 평균 흡연량 */}
            <div className="p-4">
              {formData.smoking?.isSmoking == true && (
                <div className="mb-6">
                  <Label htmlFor="smokingAmount" className="font-bold">
                    하루 평균 흡연량
                  </Label>
                  <div className="flex gap-2">
                    {smokingDailyCounts.map((count) => (
                      <Button
                        key={count}
                        id="smokingAmount"
                        type="button"
                        variant={
                          formData.smoking?.smokingAmount === count
                            ? 'secondary'
                            : 'outline'
                        }
                        className="p-3 mt-3 font-medium rounded-lg"
                        size="lg"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            smoking: {
                              ...formData.smoking,
                              smokingAmount: count,
                            },
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
                    key={drinking.label}
                    id="isDrinking"
                    type="button"
                    variant={
                      formData.drinking?.isDrinking === drinking.value
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        drinking: {
                          ...formData.drinking,
                          isDrinking: drinking.value,
                        },
                      })
                    }>
                    {drinking.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 음주 횟수 */}
            <div className="p-4">
              {formData.drinking?.isDrinking == true && (
                <div className="mb-6">
                  <Label htmlFor="drinkingAmount" className="font-bold">
                    음주 횟수
                  </Label>
                  <div className="flex gap-2">
                    {drkingWeeklyCounts.map((count) => (
                      <Button
                        key={count}
                        id="drinkingAmount"
                        type="button"
                        variant={
                          formData.drinking?.drinkingAmount === count
                            ? 'secondary'
                            : 'outline'
                        }
                        className="p-3 mt-3 font-medium rounded-lg"
                        size="lg"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            drinking: {
                              ...formData.drinking,
                              drinkingAmount: count,
                            },
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
              <Label htmlFor="mealPattern" className="font-bold">
                하루 식사 패턴
              </Label>
              <div className="flex gap-2">
                {dailyEatingTypes.map((type) => (
                  <Button
                    key={type}
                    id="mealPattern"
                    type="button"
                    variant={
                      formData.nutrition?.mealPattern === type
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        nutrition: {
                          ...formData.nutrition,
                          mealPattern: type,
                        },
                      })
                    }>
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* 식생활 특이사항 */}
            <div className="p-4">
              <Label htmlFor="nutritionNote" className="font-bold">
                식생활 특이사항
              </Label>
              <Input
                id="nutritionNote"
                name="nutritionNote"
                placeholder="예:잇몸 문제로 딱딱한 음식 섭취 어려움"
                value={formData.nutrition?.nutritionNote || ''}
                onChange={(e) => handleInputChange('nutrition', e)}
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
              <Label htmlFor="exercisePattern" className="font-bold">
                주간 운동 패턴
              </Label>
              <div className="flex gap-2">
                {exerciseWeeklyCounts.map((count) => (
                  <Button
                    key={count}
                    id="exercisePattern"
                    type="button"
                    variant={
                      formData.exercise?.exercisePattern === count
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        exercise: {
                          ...formData.exercise,
                          exercisePattern: count,
                        },
                      })
                    }>
                    {count}
                  </Button>
                ))}
              </div>
            </div>

            {/* 규칙적으로 하는 운동 종류 */}
            <div className="w-1/4 p-4">
              {formData.exercise?.exercisePattern != '운동 안 함' && (
                <div className="mb-6">
                  <Label htmlFor="exerciseNote" className="font-bold">
                    규칙적으로 하는 운동 종류
                  </Label>
                  <Input
                    id="exerciseNote"
                    name="exerciseNote"
                    placeholder="예: 산책, 수영"
                    value={formData.exercise?.exerciseNote || ''}
                    onChange={(e) => handleInputChange('exercise', e)}
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
              <Label htmlFor="isAlone" className="font-bold">
                독거 여부
              </Label>
              <div className="flex gap-2">
                {isAloneTypes.map((living) => (
                  <Button
                    key={living.label}
                    id="isAlone"
                    type="button"
                    variant={
                      formData.medicationManagement?.isAlone === living.value
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        medicationManagement: {
                          ...formData.medicationManagement,
                          isAlone: living.value,
                        },
                      })
                    }>
                    {living.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* 동거인 구성원 */}
            <div className="w-1/4 p-4">
              {formData.medicationManagement?.isAlone == false && (
                <div className="mb-6">
                  <Label htmlFor="houseMateNote" className="font-bold">
                    동거인 구성원
                  </Label>
                  <Input
                    id="houseMateNote"
                    name="houseMateNote"
                    placeholder="예: 손녀"
                    value={formData.medicationManagement?.houseMateNote || ''}
                    onChange={(e) =>
                      handleInputChange('medicationManagement', e)
                    }
                    className="mt-3"
                  />
                </div>
              )}
            </div>
            {/* 복용자 및 투약 보조자 */}
            <div className="p-4">
              <Label htmlFor="medicationAssistants" className="font-bold">
                복용자 및 투약 보조자
              </Label>
              <p className="mt-3 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>
              <div className="flex gap-2">
                {medicinetakingMembers.map((member) => (
                  <Button
                    key={member}
                    id="medicationAssistants"
                    type="button"
                    variant={
                      formData.medicationManagement?.medicationAssistants?.includes(
                        member,
                      )
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
