import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { useCounselCardStore } from '@/pages/Survey/hooks/counselCardStore';
import {
  useCounselCardBaseInfoQuery,
  useCounselCardHealthInfoQuery,
  useCounselCardIndependentLifeInfoQuery,
  useCounselCardLivingInfoQuery,
} from '@/pages/Survey/hooks/useCounselCardQuery';
import { SelectPreviousItemListByInformationNameAndItemNameTypeEnum } from '@/api';
import { useInitializeHistoryData } from '../../hooks/query/useHistoryQuery';

// 새로운 섹션 컴포넌트들 import
import CounselPurposeSection from '../sections/CounselPurposeSection';
import HealthInfoSection from '../sections/HealthInfoSection';
import LivingInfoSection from '../sections/LivingInfoSection';
import IndependentLifeSection from '../sections/IndependentLifeSection';

const ConsultCard: React.FC = () => {
  const { counselSessionId } = useParams();
  const { setShouldFetch } = useCounselCardStore();

  // 히스토리 데이터 초기화
  useInitializeHistoryData(counselSessionId || '', [
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.CounselPurposeAndNote,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.DiseaseInfo,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Allergy,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationSideEffect,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Smoking,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Drinking,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Exercise,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationManagement,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Nutrition,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Communication,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Walking,
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Evacuation,
  ]);

  // 컴포넌트 마운트시 데이터 새로고침 트리거
  useEffect(() => {
    if (counselSessionId) {
      setShouldFetch('base', true);
      setShouldFetch('health', true);
      setShouldFetch('independentLife', true);
      setShouldFetch('living', true);
    }
  }, [counselSessionId, setShouldFetch]);

  const { data: baseInfoData } = useCounselCardBaseInfoQuery(
    counselSessionId || '',
  );
  const { data: healthInfoData } = useCounselCardHealthInfoQuery(
    counselSessionId || '',
  );
  const { data: independentLifeInfoData } =
    useCounselCardIndependentLifeInfoQuery(counselSessionId || '');
  const { data: livingInfoData } = useCounselCardLivingInfoQuery(
    counselSessionId || '',
  );

  const handleOpenSurveyInNewTab = () => {
    const surveyUrl = `/survey/${counselSessionId}`;
    window.open(surveyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 카드 */}
      <Card>
        <CardHeader className="absolute right-10">
          <Button variant="secondary" onClick={handleOpenSurveyInNewTab}>
            기초 설문 수정하기
          </Button>
        </CardHeader>
        <div className="columns-1 gap-6 md:columns-2 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {/* 상담 목적 및 특이사항 섹션 */}
          <CounselPurposeSection baseInfoData={baseInfoData} />
          {/* 생활 정보 섹션 */}
          <LivingInfoSection livingInfoData={livingInfoData} />

          {/* 건강 정보 섹션 */}
          <HealthInfoSection healthInfoData={healthInfoData} />

          {/* 자립생활 역량 섹션 */}
          <IndependentLifeSection
            independentLifeInfoData={independentLifeInfoData}
          />
        </div>
      </Card>
    </div>
  );
};

export default ConsultCard;
