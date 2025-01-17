import CardContainer from '@/components/common/CardContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TabContentContainer from '@/components/consult/TabContentContainer';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/reduxHooks';
import { changeActiveTab } from '@/reducers/tabReducer';
import { HealthInformationDTO } from '@/api';
import { useCounselAssistantStore } from '@/store/counselAssistantStore';
import {
  diseaseList,
  isAllergyTypes,
  isMedicineTypes,
} from '@/pages/assistant/constants/healthInfo';

const HealthInfo = () => {
  // 새로고침이 되었을 때도 active tab 을 잃지 않도록 컴포넌트 load 시 dispatch
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(changeActiveTab('/assistant/view/healthInfo')); // 해당 tab의 url
  }, [dispatch]);
  const { counselAssistant, setCounselAssistant } = useCounselAssistantStore();
  const [formData, setFormData] = useState<HealthInformationDTO>(
    counselAssistant.healthInformation || {
      diseaseInfo: {
        diseases: [],
        historyNote: '',
        mainInconvenienceNote: '',
      },
      allergy: {
        isAllergy: false,
        allergyNote: '',
      },
      medicationSideEffect: {
        isSideEffect: false,
        suspectedMedicationNote: '',
        symptomsNote: '',
      },
    },
  );

  const toggleDisease = (disease: string) => {
    setFormData((prev) => ({
      ...prev,
      diseaseInfo: {
        ...prev.diseaseInfo,
        diseases: prev.diseaseInfo?.diseases?.includes(disease)
          ? prev.diseaseInfo?.diseases?.filter((item) => item !== disease)
          : [...(prev.diseaseInfo?.diseases ?? []), disease],
      },
    }));
  };

  const handleInputChange = (
    section: 'diseaseInfo' | 'allergy' | 'medicationSideEffect',
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
      healthInformation: formData,
    });
  }, [formData, setCounselAssistant, counselAssistant]);

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
                      formData.diseaseInfo?.diseases?.includes(disease)
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
              <Label htmlFor="historyNote" className="font-bold">
                질병 및 수술 이력
              </Label>
              <Input
                id="historyNote"
                name="historyNote"
                placeholder="과거 질병 및 수술 이력을 작성해주세요."
                value={formData.diseaseInfo?.historyNote || ''}
                onChange={(e) => handleInputChange('diseaseInfo', e)}
                className="pt-5 mt-3 pb-36"
              />
            </div>

            {/* 주요 불편 증상 */}
            <div className="p-4">
              <Label htmlFor="mainInconvenienceNote" className="font-bold">
                주요 불편 증상
              </Label>
              <Input
                id="mainInconvenienceNote"
                name="mainInconvenienceNote"
                placeholder="건강상 불편한 점을 작성해주세요."
                value={formData.diseaseInfo?.mainInconvenienceNote || ''}
                onChange={(e) => handleInputChange('diseaseInfo', e)}
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
                    key={allergy.label}
                    id="isAllergy"
                    type="button"
                    variant={
                      formData.allergy?.isAllergy === allergy.value
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        allergy: {
                          ...formData.allergy,
                          isAllergy: allergy.value,
                        },
                      })
                    }>
                    {allergy.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 알레르기 의심 식품/약품 */}
            <div className="p-4">
              {formData.allergy?.isAllergy == true && (
                <div className="mb-6">
                  <Label htmlFor="allergyNote" className="font-bold">
                    의심 식품/약물
                  </Label>
                  <Input
                    id="allergyNote"
                    name="allergyNote"
                    placeholder="예: 땅콩, 돼지고기"
                    value={formData.allergy?.allergyNote || ''}
                    onChange={(e) => handleInputChange('allergy', e)}
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
                    key={medicine.label}
                    id="isMedicine"
                    type="button"
                    variant={
                      formData.medicationSideEffect?.isSideEffect ===
                      medicine.value
                        ? 'secondary'
                        : 'outline'
                    }
                    className="p-3 mt-3 font-medium rounded-lg"
                    size="lg"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        medicationSideEffect: {
                          ...formData.medicationSideEffect,
                          isSideEffect: medicine.value,
                        },
                      })
                    }>
                    {medicine.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 부작용 의심 약물 */}
            <div className="p-4">
              {formData.medicationSideEffect?.isSideEffect == true && (
                <div className="mb-6">
                  <Label
                    htmlFor="suspectedMedicationNote"
                    className="font-bold">
                    부작용 의심 약물
                  </Label>
                  <Input
                    id="suspectedMedicationNote"
                    name="suspectedMedicationNote"
                    placeholder="예: 항암제"
                    value={
                      formData.medicationSideEffect.suspectedMedicationNote ||
                      ''
                    }
                    onChange={(e) =>
                      handleInputChange('medicationSideEffect', e)
                    }
                    className="pt-5 mt-3 pb-36"
                  />
                </div>
              )}
            </div>

            {/* 부작용 증상 */}
            <div className="p-4">
              {formData.medicationSideEffect?.isSideEffect == true && (
                <div className="mb-6">
                  <Label htmlFor="symptomsNote" className="font-bold">
                    부작용 증상
                  </Label>
                  <Input
                    id="symptomsNote"
                    name="symptomsNote"
                    placeholder="예: 손발 저림, 오심, 구토, 탈모"
                    value={formData.medicationSideEffect.symptomsNote || ''}
                    onChange={(e) =>
                      handleInputChange('medicationSideEffect', e)
                    }
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
