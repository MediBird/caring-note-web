import React from 'react';
import {
  CounselCardBaseInformationRes,
  CounselPurposeAndNoteDTOCounselPurposeEnum,
  SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
} from '@/api';
import { COUNSEL_PURPOSE_MAP } from '@/utils/constants';
import ContentCard from '@/components/common/ContentCard';
import SectionContainer from '@/components/common/SectionContainer';

interface CounselPurposeSectionProps {
  baseInfoData: CounselCardBaseInformationRes | null | undefined;
}

const CounselPurposeSection: React.FC<CounselPurposeSectionProps> = ({
  baseInfoData,
}) => {
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

  // 상담 목적 히스토리 포맷팅 함수
  const formatCounselPurposeHistory = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const purposeData = data as {
        counselPurpose?: string[];
        significantNote?: string;
        medicationNote?: string;
      };

      const items: string[] = [];

      if (
        purposeData.counselPurpose &&
        Array.isArray(purposeData.counselPurpose)
      ) {
        const purposes = purposeData.counselPurpose
          .map(
            (purpose) =>
              COUNSEL_PURPOSE_MAP[
                purpose as CounselPurposeAndNoteDTOCounselPurposeEnum
              ],
          )
          .filter(Boolean)
          .join(', ');
        if (purposes) items.push(purposes);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

  // 특이사항 히스토리 포맷팅 함수
  const formatSignificantNoteHistory = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const purposeData = data as {
        counselPurpose?: string[];
        significantNote?: string;
        medicationNote?: string;
      };

      const items: string[] = [];

      if (purposeData.significantNote) {
        items.push(purposeData.significantNote);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

  // 약물 히스토리 포맷팅 함수
  const formatMedicationHistory = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const purposeData = data as {
        counselPurpose?: string[];
        significantNote?: string;
        medicationNote?: string;
      };

      const items: string[] = [];

      if (purposeData.medicationNote) {
        items.push(purposeData.medicationNote);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

  return (
    <SectionContainer title="상담 목적 및 특이사항" variant="default">
      <ContentCard
        title="상담 목적"
        items={counselPurposeItems}
        hasHistory={true}
        historyType={
          SelectPreviousItemListByInformationNameAndItemNameTypeEnum.CounselPurposeAndNote
        }
        badgeText="상담"
        formatHistoryItem={formatCounselPurposeHistory}
      />
      <ContentCard
        title="특이사항"
        items={significantNoteItems}
        hasHistory={true}
        historyType={
          SelectPreviousItemListByInformationNameAndItemNameTypeEnum.CounselPurposeAndNote
        }
        badgeText="특이사항"
        formatHistoryItem={formatSignificantNoteHistory}
      />
      <ContentCard
        title="약물"
        items={medicationItems}
        hasHistory={true}
        historyType={
          SelectPreviousItemListByInformationNameAndItemNameTypeEnum.CounselPurposeAndNote
        }
        badgeText="약물"
        formatHistoryItem={formatMedicationHistory}
      />
    </SectionContainer>
  );
};

export default CounselPurposeSection;
