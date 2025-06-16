import React from 'react';
import {
  CounselCardBaseInformationRes,
  CounselPurposeAndNoteDTOCounselPurposeEnum,
} from '@/api';
import { COUNSEL_PURPOSE_MAP } from '@/utils/constants';
import ContentCard from '@/components/common/ContentCard';
import SectionContainer from '@/components/common/SectionContainer';
import {
  useBaseInformationHistoryQuery,
  useHistoryData,
} from '../../hooks/query/useHistoryQuery';
import { LocalHistoryTypeEnum } from '../../hooks/store/useHistoryStore';
import {
  formatCounselPurposeHistory,
  formatMedicationHistory,
  formatSignificantNoteHistory,
} from '../../utils/historyFormatters';

interface CounselPurposeSectionProps {
  baseInfoData: CounselCardBaseInformationRes | null | undefined;
  counselSessionId: string;
}

const CounselPurposeSection: React.FC<CounselPurposeSectionProps> = ({
  baseInfoData,
  counselSessionId,
}) => {
  // 히스토리 쿼리 실행
  useBaseInformationHistoryQuery(counselSessionId);

  // 각 타입별로 분리된 히스토리 데이터 가져오기
  const counselPurposeHistory = useHistoryData(
    LocalHistoryTypeEnum.CounselPurpose,
  );
  const significantNoteHistory = useHistoryData(
    LocalHistoryTypeEnum.SignificantNote,
  );
  const medicationHistory = useHistoryData(LocalHistoryTypeEnum.MedicationNote);

  const counselPurposeItems = [
    {
      value: Array.isArray(baseInfoData?.counselPurposeAndNote?.counselPurpose)
        ? baseInfoData?.counselPurposeAndNote.counselPurpose
            .map(
              (purpose: CounselPurposeAndNoteDTOCounselPurposeEnum) =>
                COUNSEL_PURPOSE_MAP[
                  purpose as CounselPurposeAndNoteDTOCounselPurposeEnum
                ],
            )
            .join(', ')
        : null,
    },
  ];

  const significantNoteItems = [
    {
      value: baseInfoData?.counselPurposeAndNote?.significantNote || null,
    },
  ];

  const medicationItems = [
    {
      value: baseInfoData?.counselPurposeAndNote?.medicationNote || null,
    },
  ];

  return (
    <SectionContainer title="상담 목적 및 특이사항" variant="default">
      <ContentCard
        title="상담 목적"
        items={counselPurposeItems}
        hasHistory={true}
        historyData={counselPurposeHistory.historyData}
        isHistoryLoading={counselPurposeHistory.isLoading}
        hasHistoryData={
          counselPurposeHistory.hasData && counselPurposeHistory.isInitialized
        }
        badgeText="상담"
        formatHistoryItem={formatCounselPurposeHistory}
      />
      <ContentCard
        title="특이사항"
        items={significantNoteItems}
        hasHistory={true}
        historyData={significantNoteHistory.historyData}
        isHistoryLoading={significantNoteHistory.isLoading}
        hasHistoryData={
          significantNoteHistory.hasData && significantNoteHistory.isInitialized
        }
        badgeText="특이사항"
        formatHistoryItem={formatSignificantNoteHistory}
      />
      <ContentCard
        title="약물"
        items={medicationItems}
        hasHistory={true}
        historyData={medicationHistory.historyData}
        isHistoryLoading={medicationHistory.isLoading}
        hasHistoryData={
          medicationHistory.hasData && medicationHistory.isInitialized
        }
        badgeText="약물"
        formatHistoryItem={formatMedicationHistory}
      />
    </SectionContainer>
  );
};

export default CounselPurposeSection;
