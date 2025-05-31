import React from 'react';
import {
  BaseInfoDTOHealthInsuranceTypeEnum,
  CounselCardBaseInformationRes,
  CounselPurposeAndNoteDTOCounselPurposeEnum,
} from '@/api';
import {
  COUNSEL_PURPOSE_MAP,
  HEALTH_INSURANCE_TYPE_MAP,
} from '@/utils/constants';
import ContentCard from '@/components/common/ContentCard';
import SectionContainer from '@/components/common/SectionContainer';

interface CounselPurposeSectionProps {
  baseInfoData: CounselCardBaseInformationRes | null | undefined;
}

const CounselPurposeSection: React.FC<CounselPurposeSectionProps> = ({
  baseInfoData,
}) => {
  const baseInfoItems = [
    {
      label: '성명',
      value: baseInfoData?.baseInfo?.counseleeName || '-',
    },
    {
      label: '생년월일',
      value: baseInfoData?.baseInfo?.birthDate || '-',
    },
    {
      label: '의료보장형태',
      value: baseInfoData?.baseInfo?.healthInsuranceType
        ? HEALTH_INSURANCE_TYPE_MAP[
            baseInfoData.baseInfo
              .healthInsuranceType as BaseInfoDTOHealthInsuranceTypeEnum
          ]
        : '-',
    },
  ];

  const counselPurposeItems = [
    {
      label: '상담 목적',
      value: Array.isArray(baseInfoData?.counselPurposeAndNote?.counselPurpose)
        ? baseInfoData?.counselPurposeAndNote.counselPurpose
            .map(
              (purpose: CounselPurposeAndNoteDTOCounselPurposeEnum) =>
                COUNSEL_PURPOSE_MAP[
                  purpose as CounselPurposeAndNoteDTOCounselPurposeEnum
                ],
            )
            .join(', ')
        : '-',
    },
    {
      label: '특이사항',
      value: baseInfoData?.counselPurposeAndNote?.significantNote || '-',
    },
    {
      label: '의약품',
      value: baseInfoData?.counselPurposeAndNote?.medicationNote || '-',
    },
  ];

  return (
    <SectionContainer title="상담 목적 및 특이사항" variant="default">
      <ContentCard
        title="기본 정보"
        items={baseInfoItems}
        hasHistory={false}
        badgeVariant="default"
        badgeText="기본"
      />
      <ContentCard
        title="상담 목적 및 특이사항"
        items={counselPurposeItems}
        hasHistory={true}
        historyActive={true}
        badgeVariant="default"
        badgeText="상담"
      />
    </SectionContainer>
  );
};

export default CounselPurposeSection;
