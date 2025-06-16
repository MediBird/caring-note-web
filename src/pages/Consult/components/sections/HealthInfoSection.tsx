import React from 'react';
import {
  CounselCardHealthInformationRes,
  SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
  DiseaseInfoDTODiseasesEnum,
} from '@/api';
import { DISEASE_MAP } from '@/utils/constants';
import ContentCard from '@/components/common/ContentCard';
import SectionContainer from '@/components/common/SectionContainer';

interface HealthInfoSectionProps {
  healthInfoData: CounselCardHealthInformationRes | null | undefined;
}

const HealthInfoSection: React.FC<HealthInfoSectionProps> = ({
  healthInfoData,
}) => {
  // 질병 리스트 (라벨 없이 | 구분자로 표시)
  const diseaseItems = [
    {
      value:
        healthInfoData?.diseaseInfo?.diseases
          ?.map((disease) => DISEASE_MAP[disease])
          .join(' | ') || null,
    },
  ];

  // 질병 및 수술 이력 (라벨 없이 컨텐츠만)
  const diseaseHistoryItems = [
    {
      value: healthInfoData?.diseaseInfo?.historyNote || null,
    },
  ];

  // 주요 불편 증상 (라벨 없이 컨텐츠만)
  const mainInconvenienceItems = [
    {
      value: healthInfoData?.diseaseInfo?.mainInconvenienceNote || null,
    },
  ];

  // 약물 부작용 (라벨 포함)
  const medicationSideEffectItems = [
    ...(healthInfoData?.medicationSideEffect?.isMedicationSideEffect
      ? [
          {
            label: '부작용 의심 약물',
            value:
              healthInfoData?.medicationSideEffect?.suspectedMedicationNote ||
              null,
          },
          {
            label: '부작용 증상',
            value: healthInfoData?.medicationSideEffect?.symptomsNote || null,
          },
        ]
      : []),
  ];

  // 알레르기 (라벨 포함)
  const allergyItems = [
    ...(healthInfoData?.allergy?.isAllergic
      ? [
          {
            label: '의심 식품/약물',
            value: healthInfoData?.allergy?.allergyNote || null,
          },
        ]
      : []),
  ];

  // 약물 부작용과 알레르기 컨텐츠 길이 계산
  const medicationSideEffectContentLength =
    (healthInfoData?.medicationSideEffect?.suspectedMedicationNote?.length ||
      0) + (healthInfoData?.medicationSideEffect?.symptomsNote?.length || 0);

  const allergyContentLength =
    healthInfoData?.allergy?.allergyNote?.length || 0;

  // 컨텐츠가 길 때만 세로로 스택 (기본은 가로 배치)
  const shouldStackSideEffectAndAllergy =
    medicationSideEffectContentLength > 50 || allergyContentLength > 50;

  // 질병 정보 히스토리 포맷팅 함수 (앓고 있는 질병용)
  const formatDiseaseHistory = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const diseaseData = data as {
        diseases?: string[];
        historyNote?: string;
        mainInconvenienceNote?: string;
      };

      const items: string[] = [];

      if (diseaseData.diseases && Array.isArray(diseaseData.diseases)) {
        const diseases = diseaseData.diseases
          .map((disease) => DISEASE_MAP[disease as DiseaseInfoDTODiseasesEnum])
          .filter(Boolean)
          .join(' · ');
        if (diseases) items.push(diseases);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

  // 질병 및 수술 이력 히스토리 포맷팅 함수
  const formatDiseaseHistoryNote = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const diseaseData = data as {
        diseases?: string[];
        historyNote?: string;
        mainInconvenienceNote?: string;
      };

      const items: string[] = [];

      if (diseaseData.historyNote) {
        items.push(diseaseData.historyNote);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

  // 주요 불편 증상 히스토리 포맷팅 함수
  const formatMainInconvenienceHistory = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const diseaseData = data as {
        diseases?: string[];
        historyNote?: string;
        mainInconvenienceNote?: string;
      };

      const items: string[] = [];

      if (diseaseData.mainInconvenienceNote) {
        items.push(diseaseData.mainInconvenienceNote);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

  // 알레르기 히스토리 포맷팅 함수
  const formatAllergyHistory = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const allergyData = data as {
        isAllergic?: boolean;
        allergyNote?: string;
      };

      const items: string[] = [];

      if (allergyData.isAllergic !== undefined) {
        items.push(
          `알레르기 여부: ${allergyData.isAllergic ? '있음' : '없음'}`,
        );
      }

      if (allergyData.allergyNote) {
        items.push(`의심 식품/약물: ${allergyData.allergyNote}`);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

  // 약물 부작용 히스토리 포맷팅 함수
  const formatMedicationSideEffectHistory = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const sideEffectData = data as {
        isMedicationSideEffect?: boolean;
        suspectedMedicationNote?: string;
        symptomsNote?: string;
      };

      const items: string[] = [];

      if (sideEffectData.isMedicationSideEffect !== undefined) {
        items.push(
          `부작용 여부: ${sideEffectData.isMedicationSideEffect ? '있음' : '없음'}`,
        );
      }

      if (sideEffectData.suspectedMedicationNote) {
        items.push(
          `부작용 의심 약물: ${sideEffectData.suspectedMedicationNote}`,
        );
      }

      if (sideEffectData.symptomsNote) {
        items.push(`부작용 증상: ${sideEffectData.symptomsNote}`);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

  return (
    <SectionContainer title="건강 정보" variant="primary">
      {/* 앓고 있는 질병 */}
      <ContentCard
        title="앓고 있는 질병"
        items={diseaseItems}
        hasHistory={true}
        historyType={
          SelectPreviousItemListByInformationNameAndItemNameTypeEnum.DiseaseInfo
        }
        formatHistoryItem={formatDiseaseHistory}
      />

      {/* 질병 및 수술 이력 */}
      <ContentCard
        title="질병 및 수술 이력"
        items={diseaseHistoryItems}
        hasHistory={true}
        historyType={
          SelectPreviousItemListByInformationNameAndItemNameTypeEnum.DiseaseInfo
        }
        formatHistoryItem={formatDiseaseHistoryNote}
      />

      {/* 주요 불편 증상 */}
      <ContentCard
        title="주요 불편 증상"
        items={mainInconvenienceItems}
        hasHistory={true}
        historyType={
          SelectPreviousItemListByInformationNameAndItemNameTypeEnum.DiseaseInfo
        }
        formatHistoryItem={formatMainInconvenienceHistory}
      />

      {/* 약물 부작용 & 알레르기 */}
      <div
        className={
          shouldStackSideEffectAndAllergy
            ? 'space-y-4 md:col-span-2'
            : 'grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2'
        }>
        {/* 약물 부작용 */}
        <ContentCard
          title="약물 부작용"
          items={medicationSideEffectItems}
          hasHistory={true}
          historyType={
            SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationSideEffect
          }
          badgeVariant={
            healthInfoData?.medicationSideEffect?.isMedicationSideEffect
              ? 'errorLight'
              : 'primaryLight'
          }
          badgeText={
            healthInfoData?.medicationSideEffect?.isMedicationSideEffect
              ? '부작용 있음'
              : '부작용 없음'
          }
          formatHistoryItem={formatMedicationSideEffectHistory}
        />

        {/* 알레르기 */}
        <ContentCard
          title="알레르기"
          items={allergyItems}
          hasHistory={true}
          historyType={
            SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Allergy
          }
          badgeVariant={
            healthInfoData?.allergy?.isAllergic ? 'errorLight' : 'primaryLight'
          }
          badgeText={
            healthInfoData?.allergy?.isAllergic
              ? '알레르기 있음'
              : '알레르기 없음'
          }
          formatHistoryItem={formatAllergyHistory}
        />
      </div>
    </SectionContainer>
  );
};

export default HealthInfoSection;
