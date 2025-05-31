import React from 'react';
import { CounselCardHealthInformationRes } from '@/api';
import { DISEASE_MAP } from '@/utils/constants';
import ContentCard from '@/components/common/ContentCard';
import SectionContainer from '@/components/common/SectionContainer';

interface HealthInfoSectionProps {
  healthInfoData: CounselCardHealthInformationRes | null | undefined;
}

const HealthInfoSection: React.FC<HealthInfoSectionProps> = ({
  healthInfoData,
}) => {
  const diseaseItems = [
    {
      label: '질병',
      value:
        healthInfoData?.diseaseInfo?.diseases
          ?.map((disease) => DISEASE_MAP[disease])
          .join(' · ') || null,
    },
    {
      label: '질병 및 수술 이력',
      value: healthInfoData?.diseaseInfo?.historyNote || null,
    },
    {
      label: '주요 불편 증상',
      value: healthInfoData?.diseaseInfo?.mainInconvenienceNote || null,
    },
  ];

  const allergyItems = [
    {
      label: '알레르기 여부',
      value: healthInfoData?.allergy?.isAllergic ? '알레르기 있음' : null,
    },
    ...(healthInfoData?.allergy?.isAllergic
      ? [
          {
            label: '의심 식품/약물',
            value: healthInfoData?.allergy?.allergyNote || null,
          },
        ]
      : []),
  ];

  const medicationSideEffectItems = [
    {
      label: '약물 부작용 여부',
      value: healthInfoData?.medicationSideEffect?.isMedicationSideEffect
        ? '약물 부작용 있음'
        : null,
    },
    ...(healthInfoData?.medicationSideEffect?.isMedicationSideEffect
      ? [
          {
            label: '부작용 증상',
            value: healthInfoData?.medicationSideEffect?.symptomsNote || null,
          },
          {
            label: '부작용 의심 약물',
            value:
              healthInfoData?.medicationSideEffect?.suspectedMedicationNote ||
              null,
          },
        ]
      : []),
  ];

  return (
    <SectionContainer title="건강 정보" variant="primary">
      <ContentCard
        title="앓고 있는 질병"
        items={diseaseItems}
        hasHistory={true}
        historyActive={true}
        badgeVariant="destructive"
        badgeText="위험"
      />
      <ContentCard
        title="알레르기"
        items={allergyItems}
        hasHistory={false}
        badgeVariant={
          healthInfoData?.allergy?.isAllergic ? 'destructive' : 'secondary'
        }
        badgeText={healthInfoData?.allergy?.isAllergic ? '주의' : '정상'}
      />
      <ContentCard
        title="약물 부작용"
        items={medicationSideEffectItems}
        hasHistory={false}
        badgeVariant={
          healthInfoData?.medicationSideEffect?.isMedicationSideEffect
            ? 'destructive'
            : 'secondary'
        }
        badgeText={
          healthInfoData?.medicationSideEffect?.isMedicationSideEffect
            ? '주의'
            : '정상'
        }
        className="md:col-span-2 xl:col-span-1"
      />
    </SectionContainer>
  );
};

export default HealthInfoSection;
