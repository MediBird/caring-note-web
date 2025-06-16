import React from 'react';
import {
  CounselCardHealthInformationRes,
  SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
} from '@/api';
import { DISEASE_MAP } from '@/utils/constants';
import ContentCard from '@/components/common/ContentCard';
import SectionContainer from '@/components/common/SectionContainer';
import {
  useHealthInformationHistoryQuery,
  useHistoryData,
} from '../../hooks/query/useHistoryQuery';
import { LocalHistoryTypeEnum } from '../../hooks/store/useHistoryStore';
import {
  formatAllergyHistory,
  formatDiseaseHistory,
  formatDiseaseHistoryNote,
  formatMainInconvenienceHistory,
  formatMedicationSideEffectHistory,
} from '../../utils/historyFormatters';

interface HealthInfoSectionProps {
  healthInfoData: CounselCardHealthInformationRes | null | undefined;
  counselSessionId: string;
}

const HealthInfoSection: React.FC<HealthInfoSectionProps> = ({
  healthInfoData,
  counselSessionId,
}) => {
  // 히스토리 쿼리 실행
  useHealthInformationHistoryQuery(counselSessionId);

  // 각 타입별로 분리된 히스토리 데이터 가져오기
  const diseasesHistory = useHistoryData(LocalHistoryTypeEnum.Diseases);
  const diseaseHistoryNoteHistory = useHistoryData(
    LocalHistoryTypeEnum.DiseaseHistoryNote,
  );
  const mainInconvenienceHistory = useHistoryData(
    LocalHistoryTypeEnum.MainInconvenienceNote,
  );
  const allergyHistory = useHistoryData(
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Allergy,
  );
  const medicationSideEffectHistory = useHistoryData(
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationSideEffect,
  );

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

  return (
    <SectionContainer title="건강 정보" variant="primary">
      {/* 앓고 있는 질병 */}
      <ContentCard
        title="앓고 있는 질병"
        items={diseaseItems}
        hasHistory={true}
        historyData={diseasesHistory.historyData}
        isHistoryLoading={diseasesHistory.isLoading}
        hasHistoryData={
          diseasesHistory.hasData && diseasesHistory.isInitialized
        }
        formatHistoryItem={formatDiseaseHistory}
      />

      {/* 질병 및 수술 이력 */}
      <ContentCard
        title="질병 및 수술 이력"
        items={diseaseHistoryItems}
        hasHistory={true}
        historyData={diseaseHistoryNoteHistory.historyData}
        isHistoryLoading={diseaseHistoryNoteHistory.isLoading}
        hasHistoryData={
          diseaseHistoryNoteHistory.hasData &&
          diseaseHistoryNoteHistory.isInitialized
        }
        formatHistoryItem={formatDiseaseHistoryNote}
      />

      {/* 주요 불편 증상 */}
      <ContentCard
        title="주요 불편 증상"
        items={mainInconvenienceItems}
        hasHistory={true}
        historyData={mainInconvenienceHistory.historyData}
        isHistoryLoading={mainInconvenienceHistory.isLoading}
        hasHistoryData={
          mainInconvenienceHistory.hasData &&
          mainInconvenienceHistory.isInitialized
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
          historyData={medicationSideEffectHistory.historyData}
          isHistoryLoading={medicationSideEffectHistory.isLoading}
          hasHistoryData={
            medicationSideEffectHistory.hasData &&
            medicationSideEffectHistory.isInitialized
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
          historyData={allergyHistory.historyData}
          isHistoryLoading={allergyHistory.isLoading}
          hasHistoryData={
            allergyHistory.hasData && allergyHistory.isInitialized
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
