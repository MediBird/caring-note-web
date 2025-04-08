import { DiseaseInfoDTODiseasesEnum } from '@/api';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/card-section';
import { Textarea } from '@/components/ui/textarea';
import { DISEASE_OPTIONS } from '../../../../utils/constants';
import { useCounselCardStore } from '../../hooks/counselCardStore';

const allergyOptions = [
  { label: '알레르기 있음', value: 'true' },
  { label: '알레르기 없음', value: 'false' },
];

const sideEffectOptions = [
  { label: '약물 부작용 있음', value: 'true' },
  { label: '약물 부작용 없음', value: 'false' },
];

type HealthInfoField = {
  section: 'diseaseInfo' | 'allergy' | 'medicationSideEffect';
  key:
    | 'historyNote'
    | 'mainInconvenienceNote'
    | 'allergyNote'
    | 'suspectedMedicationNote'
    | 'symptomsNote';
};

export default function HealthInfo() {
  const { infoData, setInfoData } = useCounselCardStore();
  const healthInfo = infoData.health;

  const handleDiseaseChange = (value: string) => {
    const enumValue = value as DiseaseInfoDTODiseasesEnum;
    let currentDiseases = healthInfo?.diseaseInfo?.diseases || [];

    if (currentDiseases.includes(enumValue)) {
      currentDiseases = currentDiseases.filter(
        (disease: DiseaseInfoDTODiseasesEnum) => disease !== enumValue,
      );
    } else {
      currentDiseases.push(enumValue);
    }

    setInfoData('health', {
      ...healthInfo,
      diseaseInfo: {
        ...healthInfo?.diseaseInfo,
        diseases: currentDiseases,
      },
    });
  };

  const handleTextChange = (field: string, value: string | boolean) => {
    const [section, key] = field.split('.') as [
      HealthInfoField['section'],
      HealthInfoField['key'],
    ];
    setInfoData('health', {
      ...healthInfo,
      [section]: {
        ...healthInfo?.[section],
        [key]: value,
      },
    });
  };

  return (
    <Card className="flex w-full flex-col gap-5">
      <CardSection
        title="앓고 있는 질병"
        variant="primary"
        items={[
          {
            label: (
              <>
                앓고 있는 질병<span className="text-red-500">*</span>
              </>
            ),
            subLabel: '여러 개를 동시에 선택할 수 있어요',
            value: (
              <ButtonGroup
                options={DISEASE_OPTIONS}
                value={Array.from(healthInfo?.diseaseInfo?.diseases || [])}
                onChange={handleDiseaseChange}
                className="flex-wrap"
                multiple
              />
            ),
          },
          {
            label: '질병 및 수술 이력',
            value: (
              <Textarea
                placeholder="과거 질병 및 수술 이력을 작성해주세요."
                className="min-h-[100px] w-full rounded border p-2"
                value={healthInfo?.diseaseInfo?.historyNote || ''}
                onChange={(e) =>
                  handleTextChange('diseaseInfo.historyNote', e.target.value)
                }
              />
            ),
          },
          {
            label: '주요 불편 증상',
            value: (
              <Textarea
                placeholder="건강상 불편한 점을 작성해주세요."
                className="min-h-[100px] w-full rounded border p-2"
                value={healthInfo?.diseaseInfo?.mainInconvenienceNote || ''}
                onChange={(e) =>
                  handleTextChange(
                    'diseaseInfo.mainInconvenienceNote',
                    e.target.value,
                  )
                }
              />
            ),
          },
        ]}
      />
      <CardSection
        title="알레르기"
        items={[
          {
            label: '알레르기 유무',
            value: (
              <ButtonGroup
                options={allergyOptions}
                value={
                  healthInfo?.allergy?.isAllergic === null
                    ? ''
                    : healthInfo?.allergy?.isAllergic
                      ? 'true'
                      : 'false'
                }
                onChange={(value) => {
                  if (
                    (value === 'true' &&
                      healthInfo?.allergy?.isAllergic === true) ||
                    (value === 'false' &&
                      healthInfo?.allergy?.isAllergic === false)
                  ) {
                    setInfoData('health', {
                      ...healthInfo,
                      allergy: {
                        ...healthInfo?.allergy,
                        isAllergic: null,
                        allergyNote: '',
                      },
                    });
                  } else {
                    const isAllergic = value === 'true';
                    setInfoData('health', {
                      ...healthInfo,
                      allergy: {
                        isAllergic,
                        allergyNote: isAllergic
                          ? healthInfo?.allergy?.allergyNote || ''
                          : '',
                      },
                    });
                  }
                }}
                className="flex-wrap"
              />
            ),
          },
          ...(healthInfo?.allergy?.isAllergic
            ? [
                {
                  label: '의심 식품/약물',
                  value: (
                    <Textarea
                      placeholder="알레르기 의심 식품/약물을 작성해주세요."
                      className="min-h-[100px] w-full rounded border p-2"
                      value={healthInfo?.allergy?.allergyNote || ''}
                      onChange={(e) =>
                        setInfoData('health', {
                          ...healthInfo,
                          allergy: {
                            isAllergic: true,
                            allergyNote: e.target.value,
                          },
                        })
                      }
                    />
                  ),
                },
              ]
            : []),
        ]}
      />
      <CardSection
        title="약물 부작용"
        items={[
          {
            label: '약물 부작용 여부',
            value: (
              <ButtonGroup
                options={sideEffectOptions}
                value={
                  healthInfo?.medicationSideEffect?.isMedicationSideEffect ===
                  null
                    ? ''
                    : healthInfo?.medicationSideEffect?.isMedicationSideEffect
                      ? 'true'
                      : 'false'
                }
                onChange={(value) => {
                  if (
                    (value === 'true' &&
                      healthInfo?.medicationSideEffect
                        ?.isMedicationSideEffect === true) ||
                    (value === 'false' &&
                      healthInfo?.medicationSideEffect
                        ?.isMedicationSideEffect === false)
                  ) {
                    setInfoData('health', {
                      ...healthInfo,
                      medicationSideEffect: {
                        ...healthInfo?.medicationSideEffect,
                        isMedicationSideEffect: undefined,
                        symptomsNote: '',
                        suspectedMedicationNote: '',
                      },
                    });
                  } else {
                    const hasSideEffect = value === 'true';
                    setInfoData('health', {
                      ...healthInfo,
                      medicationSideEffect: {
                        ...healthInfo?.medicationSideEffect,
                        isMedicationSideEffect: hasSideEffect,
                        symptomsNote: hasSideEffect
                          ? healthInfo?.medicationSideEffect?.symptomsNote || ''
                          : '',
                        suspectedMedicationNote: hasSideEffect
                          ? healthInfo?.medicationSideEffect
                              ?.suspectedMedicationNote || ''
                          : '',
                      },
                    });
                  }
                }}
                className="flex-wrap"
              />
            ),
          },
          ...(healthInfo?.medicationSideEffect?.isMedicationSideEffect
            ? [
                {
                  label: '부작용 의심 약물',
                  value: (
                    <Textarea
                      placeholder="약물 부작용이 의심되는 품목을 작성해주세요."
                      className="min-h-[100px] w-full rounded border p-2"
                      value={
                        healthInfo?.medicationSideEffect
                          ?.suspectedMedicationNote || ''
                      }
                      onChange={(e) =>
                        handleTextChange(
                          'medicationSideEffect.suspectedMedicationNote',
                          e.target.value,
                        )
                      }
                    />
                  ),
                },
                {
                  label: '부작용 증상',
                  value: (
                    <Textarea
                      placeholder="증상과 상황을 설명해 주세요."
                      className="min-h-[100px] w-full rounded border p-2"
                      value={
                        healthInfo?.medicationSideEffect?.symptomsNote || ''
                      }
                      onChange={(e) =>
                        handleTextChange(
                          'medicationSideEffect.symptomsNote',
                          e.target.value,
                        )
                      }
                    />
                  ),
                },
              ]
            : []),
        ]}
      />
    </Card>
  );
}
