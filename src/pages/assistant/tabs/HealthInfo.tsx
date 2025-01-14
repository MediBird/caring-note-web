import { useAppDispatch } from '@/app/reduxHooks';
import CardContainer from '@/components/common/CardContainer';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changeActiveTab } from '@/reducers/tabReducer';
import { useEffect, useState } from 'react';

const diseaseList = [
  '고혈압',
  '고지혈증',
  '뇌혈관질환',
  '심장질환',
  '당뇨병',
  '갑상선질환',
  '위장관질환',
  '파킨슨',
  '치매, 인지장애',
  '수면장애',
  '우울증/불안장애',
  '신장질환',
  '간질환',
  '비뇨·생식기질환(전립선비대증, 자궁내막염, 방광염 등)',
  '암질환',
  '뇌경색',
  '척추·관절염/신경통·근육통',
  '호흡기질환(천식, COPD 등)',
  '안질환(백내장, 녹내장, 안구건조증 등)',
  '이비인후과',
];
const isAllergyTypes = ['알레르기 있음', '알레르기 없음'];
const isMedicineTypes = ['약물 부작용 있음', '약물 부작용 없음'];

const HealthInfo = () => {
  // 새로고침이 되었을 때도 active tab 을 잃지 않도록 컴포넌트 load 시 dispatch
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(changeActiveTab('/assistant/view/healthInfo')); // 해당 tab의 url
  }, [dispatch]);

  const [formData, setFormData] = useState({
    diseases: [] as string[],
    pastHistory: '',
    symptoms: '',
    isAllergy: '알레르기 있음',
    allergyDetails: '',
    isMedicine: '약물 부작용 있음',
    medicneDetails: '',
    medicneSymptoms: '',
  });

  const toggleDisease = (disease: string) => {
    setFormData((prev) => ({
      ...prev,
      diseases: prev.diseases.includes(disease)
        ? prev.diseases.filter((d) => d !== disease)
        : [...prev.diseases, disease],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <TabContentContainer>
        <div className="flex items-start justify-between space-x-4">
          {/* 앓고 있는 질병 입력 */}
          <CardContainer title={'앓고 있는 질병'} variant="grayscale">
            {/* 앓고 있는 질병 */}
            <div className="p-4">
              <div className="gap-2">
                {diseaseList.map((disease) => (
                  <Button
                    key={disease}
                    id="disease"
                    type="button"
                    variant={
                      formData.diseases.includes(disease)
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 mr-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() => toggleDisease(disease)}>
                    {disease}
                  </Button>
                ))}
              </div>
            </div>

            {/* 질병 및 수술 이력 */}
            <div className="p-4">
              <Label htmlFor="pastHistory" className="font-bold">
                질병 및 수술 이력
              </Label>
              <Input
                id="pastHistory"
                name="pastHistory"
                placeholder="과거 질병 및 수술 이력을 작성해주세요."
                value={formData.pastHistory}
                onChange={handleInputChange}
                className="pt-5 mt-3 pb-36"
              />
            </div>

            {/* 주요 불편 증상 */}
            <div className="p-4">
              <Label htmlFor="symptoms" className="font-bold">
                주요 불편 증상
              </Label>
              <Input
                id="symptoms"
                name="symptoms"
                placeholder="건강상 불편한 점을 작성해주세요."
                value={formData.symptoms}
                onChange={handleInputChange}
                className="pt-5 mt-3 pb-36"
              />
            </div>
          </CardContainer>
        </div>
        {/* 알레르기 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'알레르기'}>
            {/* 알레르기 여부 */}
            <div className="inline-block w-1/4 p-4">
              <Label htmlFor="isAllergy" className="font-bold">
                알레르기 여부
              </Label>
              <div className="flex gap-2">
                {isAllergyTypes.map((allergy) => (
                  <Button
                    key={allergy}
                    id="isAllergy"
                    type="button"
                    variant={
                      formData.isAllergy === allergy ? 'secondary' : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({ ...formData, isAllergy: allergy })
                    }>
                    {allergy}
                  </Button>
                ))}
              </div>
            </div>

            {/* 알레르기 의심 식품/약품 */}
            <div className="p-4">
              {formData.isAllergy === '알레르기 있음' && (
                <div className="mb-6">
                  <Label htmlFor="allergyDetails" className="font-bold">
                    의심 식품/약물
                  </Label>
                  <Input
                    id="allergyDetails"
                    name="allergyDetails"
                    placeholder="예: 땅콩, 돼지고기"
                    value={formData.allergyDetails}
                    onChange={handleInputChange}
                    className="pt-5 mt-3 pb-36"
                  />
                </div>
              )}
            </div>
          </CardContainer>
        </div>

        {/* 약물 부작용 */}
        <div className="flex items-start justify-between space-x-4">
          <CardContainer title={'약물 부작용'}>
            {/* 약물 부작용 여부 */}
            <div className="inline-block w-1/4 p-4">
              <Label htmlFor="isMedicine" className="font-bold">
                약물 부작용 여부
              </Label>
              <div className="flex gap-2">
                {isMedicineTypes.map((medicine) => (
                  <Button
                    key={medicine}
                    id="isMedicine"
                    type="button"
                    variant={
                      formData.isMedicine === medicine ? 'secondary' : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({ ...formData, isMedicine: medicine })
                    }>
                    {medicine}
                  </Button>
                ))}
              </div>
            </div>

            {/* 부작용 의심 약물 */}
            <div className="p-4">
              {formData.isMedicine === '약물 부작용 있음' && (
                <div className="mb-6">
                  <Label htmlFor="medicneDetails" className="font-bold">
                    부작용 의심 약물
                  </Label>
                  <Input
                    id="medicneDetails"
                    name="medicneDetails"
                    placeholder="예: 항암제"
                    value={formData.medicneDetails}
                    onChange={handleInputChange}
                    className="pt-5 mt-3 pb-36"
                  />
                </div>
              )}
            </div>

            {/* 부작용 증상 */}
            <div className="p-4">
              {formData.isMedicine === '약물 부작용 있음' && (
                <div className="mb-6">
                  <Label htmlFor="medicneSymptoms" className="font-bold">
                    부작용 증상
                  </Label>
                  <Input
                    id="medicneSymptoms"
                    name="medicneSymptoms"
                    placeholder="예: 손발 저림, 오심, 구토, 탈모"
                    value={formData.medicneSymptoms}
                    onChange={handleInputChange}
                    className="pt-5 mt-3 pb-36"
                  />
                </div>
              )}
            </div>
          </CardContainer>
        </div>
      </TabContentContainer>
    </>
  );
};
export default HealthInfo;
