import { DiseaseInfoDTODiseasesEnum } from '@/api';
import { ButtonGroup, ButtonGroupOption } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/card-section';
import { Textarea } from '@/components/ui/textarea';
import { useCounselCardStore } from '../../hooks/counselCardStore';
import { useCounselCardHealthInfoQuery } from '../../hooks/useCounselCardQuery';

interface HealthInfoProps {
  counselSessionId: string;
}

const diseaseOptions: ButtonGroupOption[] = [
  {
    label: '고혈압',
    value: DiseaseInfoDTODiseasesEnum.Hypertension,
  },
  {
    label: '고지혈증',
    value: DiseaseInfoDTODiseasesEnum.Hyperlipidemia,
  },
  {
    label: '뇌혈관질환',
    value: DiseaseInfoDTODiseasesEnum.CerebrovascularDisease,
  },
  {
    label: '심장질환',
    value: DiseaseInfoDTODiseasesEnum.HeartDisease,
  },
  {
    label: '당뇨병',
    value: DiseaseInfoDTODiseasesEnum.Diabetes,
  },
  {
    label: '갑상선질환',
    value: DiseaseInfoDTODiseasesEnum.ThyroidDisease,
  },
  {
    label: '위장관질환',
    value: DiseaseInfoDTODiseasesEnum.GastrointestinalDisease,
  },
  {
    label: '파킨슨병',
    value: DiseaseInfoDTODiseasesEnum.ParkinsonsDisease,
  },
  {
    label: '치매, 인지장애',
    value: DiseaseInfoDTODiseasesEnum.Dementia,
  },
  {
    label: '수면장애',
    value: DiseaseInfoDTODiseasesEnum.SleepDisorder,
  },
  {
    label: '우울/불안장애',
    value: DiseaseInfoDTODiseasesEnum.DepressionAnxiety,
  },
  {
    label: '신장질환',
    value: DiseaseInfoDTODiseasesEnum.KidneyDisease,
  },
  {
    label: '간질환',
    value: DiseaseInfoDTODiseasesEnum.LiverDisease,
  },
  {
    label: '비뇨·생식기질환(전립선비대증, 자궁내막염, 방광염 등)',
    value: DiseaseInfoDTODiseasesEnum.UrogenitalDisease,
  },
  {
    label: '암질환',
    value: DiseaseInfoDTODiseasesEnum.Cancer,
  },
  {
    label: '뇌경색',
    value: DiseaseInfoDTODiseasesEnum.Stroke,
  },
  {
    label: '척추·관절염/신경통·근육통',
    value: DiseaseInfoDTODiseasesEnum.SpineJointNeuropathy,
  },
  {
    label: '호흡기질환(천식, COPD 등)',
    value: DiseaseInfoDTODiseasesEnum.RespiratoryDisease,
  },
  {
    label: '안과질환(백내장, 녹내장, 안구건조증 등)',
    value: DiseaseInfoDTODiseasesEnum.EyeDisease,
  },
  {
    label: '이비인후과질환',
    value: DiseaseInfoDTODiseasesEnum.EntDisease,
  },
];

const allergyOptions: ButtonGroupOption[] = [
  { label: '알레르기 있음', value: 'true' },
  { label: '알레르기 없음', value: 'false' },
];
const medicationSideEffectOptions: ButtonGroupOption[] = [
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

export default function HealthInfo({ counselSessionId }: HealthInfoProps) {
  const { healthInfo, setHealthInfo } = useCounselCardStore();
  const { isLoading } = useCounselCardHealthInfoQuery(counselSessionId);

  const handleDiseaseChange = (value: string) => {
    const enumValue = value as DiseaseInfoDTODiseasesEnum;
    let currentDiseases = healthInfo?.diseaseInfo?.diseases || [];

    if (currentDiseases.includes(enumValue)) {
      currentDiseases = currentDiseases.filter(
        (disease) => disease !== enumValue,
      );
    } else {
      currentDiseases.push(enumValue);
    }

    setHealthInfo({
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
    setHealthInfo({
      ...healthInfo,
      [section]: {
        ...healthInfo?.[section],
        [key]: value,
      },
    });
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

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
                options={diseaseOptions}
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
                value={healthInfo?.allergy?.isAllergy ? 'true' : 'false'}
                onChange={(value) =>
                  handleTextChange(
                    'healthInfo.allergy.isAllergy',
                    value === 'true',
                  )
                }
                className="flex-wrap"
              />
            ),
          },
        ]}
      />
      <CardSection
        title="약물 부작용"
        items={[
          {
            label: '약물 부작용 여부',
            value: (
              <ButtonGroup
                options={medicationSideEffectOptions}
                value={
                  healthInfo?.medicationSideEffect?.isMedicationSideEffect
                    ? 'true'
                    : 'false'
                }
                onChange={(value) =>
                  handleTextChange(
                    'healthInfo.medicationSideEffect.isMedicationSideEffect',
                    value === 'true',
                  )
                }
                className="flex-wrap"
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
