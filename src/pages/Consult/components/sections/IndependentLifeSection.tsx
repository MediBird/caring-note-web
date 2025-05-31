import React from 'react';
import { CounselCardIndependentLifeInformationRes } from '@/api';
import {
  WALKING_METHODS_MAP,
  WALKING_EQUIPMENTS_MAP,
  EVACUATIONS_MAP,
  SIGHTS_MAP,
  HEARINGS_MAP,
  COMMUNICATIONS_MAP,
  USING_KOREANS_MAP,
} from '@/utils/constants';
import ContentCard from '@/components/common/ContentCard';
import SectionContainer from '@/components/common/SectionContainer';

interface IndependentLifeSectionProps {
  independentLifeInfoData:
    | CounselCardIndependentLifeInformationRes
    | null
    | undefined;
}

const IndependentLifeSection: React.FC<IndependentLifeSectionProps> = ({
  independentLifeInfoData,
}) => {
  if (!independentLifeInfoData) {
    return (
      <SectionContainer title="자립생활 역량" variant="accent">
        <ContentCard
          title="자립생활 역량"
          items={[
            {
              label: '상태',
              value: '자립생활 역량 정보가 없습니다.',
            },
          ]}
          badgeVariant="destructive"
          badgeText="미평가"
        />
      </SectionContainer>
    );
  }

  const walkingItems = [
    {
      label: '보행 여부',
      value:
        independentLifeInfoData?.walking?.walkingMethods
          ?.map((method) => WALKING_METHODS_MAP[method])
          .join(', ') || null,
    },
    {
      label: '이동 장비',
      value:
        independentLifeInfoData?.walking?.walkingEquipments
          ?.map((equipment) => WALKING_EQUIPMENTS_MAP[equipment])
          .join(', ') || null,
    },
    {
      label: '기타',
      value: independentLifeInfoData?.walking?.walkingNote || null,
    },
  ];

  const evacuationItems = [
    {
      label: '배변 처리 방식',
      value:
        independentLifeInfoData?.evacuation?.evacuations
          ?.map((evacuation) => EVACUATIONS_MAP[evacuation])
          .join(', ') || null,
    },
    {
      label: '기타',
      value: independentLifeInfoData?.evacuation?.evacuationNote || null,
    },
  ];

  const communicationItems = [
    {
      label: '시력',
      value:
        independentLifeInfoData?.communication?.sights
          ?.map((sight) => SIGHTS_MAP[sight])
          .join(', ') || null,
    },
    {
      label: '청력',
      value:
        independentLifeInfoData?.communication?.hearings
          ?.map((hearing) => HEARINGS_MAP[hearing])
          .join(', ') || null,
    },
    {
      label: '언어 소통',
      value: independentLifeInfoData?.communication?.communications
        ? COMMUNICATIONS_MAP[
            independentLifeInfoData.communication.communications
          ]
        : null,
    },
    {
      label: '한글 사용',
      value:
        independentLifeInfoData?.communication?.usingKoreans
          ?.map((korean) => USING_KOREANS_MAP[korean])
          .join(', ') || null,
    },
  ];

  return (
    <SectionContainer title="자립생활 역량" variant="accent">
      <ContentCard
        title="보행"
        items={walkingItems}
        hasHistory={false}
        badgeVariant="destructive"
        badgeText="중요"
      />
      <ContentCard
        title="배변 처리"
        items={evacuationItems}
        hasHistory={false}
        badgeVariant="default"
        badgeText="일상"
      />
      <ContentCard
        title="의사소통 정도"
        items={communicationItems}
        hasHistory={false}
        badgeVariant="default"
        badgeText="소통"
        className="md:col-span-2"
      />
    </SectionContainer>
  );
};

export default IndependentLifeSection;
