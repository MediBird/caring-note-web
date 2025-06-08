import React from 'react';
import {
  CounselCardBaseInformationRes,
  CounselPurposeAndNoteDTOCounselPurposeEnum,
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

  return (
    <SectionContainer title="상담 목적 및 특이사항" variant="default">
      <ContentCard
        title="상담 목적"
        items={counselPurposeItems}
        hasHistory={true}
        historyActive={true}
        badgeText="상담"
      />
      <ContentCard
        title="특이사항"
        items={significantNoteItems}
        hasHistory={true}
        historyActive={true}
        badgeText="특이사항"
      />
      <ContentCard
        title="약물"
        items={medicationItems}
        hasHistory={true}
        historyActive={true}
        badgeText="약물"
      />
    </SectionContainer>
  );
};

export default CounselPurposeSection;
