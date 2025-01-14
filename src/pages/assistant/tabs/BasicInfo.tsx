import InfoBlueIcon from '@/assets/icon/24/info.filled.blue.svg';
import Badge from '@/components/common/Badge';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/reduxHooks';
import CardContainer from '../../../components/common/CardContainer';
import { changeActiveTab } from '../../../reducers/tabReducer';

const insuranceTypes = ['건강보험', '의료급여', '보훈', '비급여'];
const consultationCounts = ['1회차', '2회차', '3회차', '4회차', '5회차 이상'];
const consultationGoals = [
  '약물 부작용 상담',
  '생활습관 관리',
  '증상/질병에 대한 이해',
  '복용약물에 대한 검토',
  '기타',
];

const BasicInfo = () => {
  // 새로고침이 되었을 때도 active tab 을 잃지 않도록 컴포넌트 load 시 dispatch
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(changeActiveTab('/assistant/view/basicInfo')); // 해당 tab의 url
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    insuranceType: '건강보험',
    consultationCount: '2회차',
    lastConsultationDate: '',
    goals: [] as string[],
    specialNotes: '',
    medications: '',
  });

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          <CardContainer title={'기본정보'} variant="grayscale">
            {/* 성명 */}
            <div className="inline-block w-1/4 p-4">
              <Label htmlFor="name" className="font-bold">
                성명
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="이름"
                value={formData.name}
                onChange={handleInputChange}
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
                placeholder="YYYYMMDD"
                value={formData.birthDate}
                onChange={handleInputChange}
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
                    key={type}
                    id="insuranceType"
                    type="button"
                    variant={
                      formData.insuranceType === type ? 'secondary' : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({ ...formData, insuranceType: type })
                    }>
                    {type}
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
                      formData.consultationCount === count
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({ ...formData, consultationCount: count })
                    }>
                    {count}
                  </Button>
                ))}
              </div>
            </div>

            {/* 최근 상담일 */}
            <div className="w-1/4 p-4">
              <Label htmlFor="lastConsultationDate" className="font-bold">
                최근 상담일
              </Label>
              <Input
                id="lastConsultationDate"
                name="lastConsultationDate"
                placeholder="YYYY-MM-DD"
                value={formData.lastConsultationDate}
                onChange={handleInputChange}
                className="mt-3"
              />
            </div>
          </CardContainer>
        </div>

        {/* 상담 목적 및 특이사항 */}
        <div className="flex items-start justify-between space-x-4 ">
          <CardContainer title={'상담 목적 및 특이사항'}>
            {/* 상담 목적 */}
            <div className="inline-block p-4">
              <Label htmlFor="goal" className="font-bold">
                상담 목적
              </Label>
              <p className="mt-3 mb-3 text-sm text-gray-500">
                여러개를 동시에 선택할 수 있어요.
              </p>
              <div className="flex gap-2">
                {consultationGoals.map((goal) => (
                  <Button
                    key={goal}
                    id="goal"
                    type="button"
                    variant={
                      formData.goals.includes(goal) ? 'secondary' : 'outline'
                    }
                    className="p-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() => toggleGoal(goal)}>
                    {goal}
                  </Button>
                ))}
              </div>
            </div>

            {/* 특이사항 */}
            <div className="p-4">
              <Label htmlFor="specialNotes" className="font-bold">
                특이사항
              </Label>
              <Input
                id="specialNotes"
                name="specialNotes"
                placeholder="특이사항 혹은 약사에게 궁금한 점을 작성해주세요."
                value={formData.specialNotes}
                onChange={handleInputChange}
                className="pt-5 mt-3 pb-36"
              />
            </div>

            {/* 의약물 */}
            <div className="p-4">
              <Label htmlFor="medications" className="font-bold">
                의약물
              </Label>
              <Input
                id="medications"
                name="medications"
                placeholder="약사님께 전달해 드릴 의약물을 작성해 주세요."
                value={formData.medications}
                onChange={handleInputChange}
                className="pt-5 mt-3 pb-36"
              />
            </div>
          </CardContainer>
        </div>
      </TabContentContainer>
    </>
  );
};
export default BasicInfo;
