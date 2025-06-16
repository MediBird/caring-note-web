import React from 'react';
import {
  CounselCardIndependentLifeInformationRes,
  SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
  CommunicationDTOSightsEnum,
  CommunicationDTOHearingsEnum,
  CommunicationDTOCommunicationsEnum,
  CommunicationDTOUsingKoreansEnum,
  WalkingDTOWalkingMethodsEnum,
  WalkingDTOWalkingEquipmentsEnum,
  EvacuationDTOEvacuationsEnum,
} from '@/api';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import HistoryPopover from '@/components/common/HistoryPopover';
import { useHistoryData } from '../../hooks/query/useHistoryQuery';

interface IndependentLifeSectionProps {
  independentLifeInfoData:
    | CounselCardIndependentLifeInformationRes
    | null
    | undefined;
}

const IndependentLifeSection: React.FC<IndependentLifeSectionProps> = ({
  independentLifeInfoData,
}) => {
  // 히스토리 데이터 가져오기
  const {
    historyData: communicationHistory,
    isLoading: communicationLoading,
    hasData: communicationHasData,
  } = useHistoryData(
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Communication,
  );
  const {
    historyData: walkingHistory,
    isLoading: walkingLoading,
    hasData: walkingHasData,
  } = useHistoryData(
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Walking,
  );
  const {
    historyData: evacuationHistory,
    isLoading: evacuationLoading,
    hasData: evacuationHasData,
  } = useHistoryData(
    SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Evacuation,
  );

  // 의사소통 히스토리 포맷팅 함수
  const formatCommunicationHistory = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const commData = data as {
        sights?: string[];
        hearings?: string[];
        communications?: string;
        usingKoreans?: string[];
      };

      const items: string[] = [];

      if (commData.sights && Array.isArray(commData.sights)) {
        const sights = commData.sights
          .map((sight) => SIGHTS_MAP[sight as CommunicationDTOSightsEnum])
          .filter(Boolean)
          .join(', ');
        if (sights) items.push(`시력: ${sights}`);
      }

      if (commData.hearings && Array.isArray(commData.hearings)) {
        const hearings = commData.hearings
          .map(
            (hearing) => HEARINGS_MAP[hearing as CommunicationDTOHearingsEnum],
          )
          .filter(Boolean)
          .join(', ');
        if (hearings) items.push(`청력: ${hearings}`);
      }

      if (commData.communications) {
        const communication =
          COMMUNICATIONS_MAP[
            commData.communications as CommunicationDTOCommunicationsEnum
          ];
        if (communication) items.push(`언어 소통: ${communication}`);
      }

      if (commData.usingKoreans && Array.isArray(commData.usingKoreans)) {
        const koreans = commData.usingKoreans
          .map(
            (korean) =>
              USING_KOREANS_MAP[korean as CommunicationDTOUsingKoreansEnum],
          )
          .filter(Boolean)
          .join(', ');
        if (koreans) items.push(`한글 사용: ${koreans}`);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

  // 보행 히스토리 포맷팅 함수
  const formatWalkingHistory = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const walkingData = data as {
        walkingMethods?: string[];
        walkingEquipments?: string[];
        walkingNote?: string;
      };

      const items: string[] = [];

      if (
        walkingData.walkingMethods &&
        Array.isArray(walkingData.walkingMethods)
      ) {
        const methods = walkingData.walkingMethods
          .map(
            (method) =>
              WALKING_METHODS_MAP[method as WalkingDTOWalkingMethodsEnum],
          )
          .filter(Boolean)
          .join(', ');
        if (methods) items.push(`보행 여부: ${methods}`);
      }

      if (
        walkingData.walkingEquipments &&
        Array.isArray(walkingData.walkingEquipments)
      ) {
        const equipments = walkingData.walkingEquipments
          .map(
            (equipment) =>
              WALKING_EQUIPMENTS_MAP[
                equipment as WalkingDTOWalkingEquipmentsEnum
              ],
          )
          .filter(Boolean)
          .join(', ');
        if (equipments) items.push(`이동 장비: ${equipments}`);
      }

      if (walkingData.walkingNote) {
        items.push(`기타 이동 장비: ${walkingData.walkingNote}`);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

  // 배변 처리 히스토리 포맷팅 함수
  const formatEvacuationHistory = (data: unknown): string[] => {
    if (typeof data === 'object' && data !== null) {
      const evacuationData = data as {
        evacuations?: string[];
        evacuationNote?: string;
      };

      const items: string[] = [];

      if (
        evacuationData.evacuations &&
        Array.isArray(evacuationData.evacuations)
      ) {
        const evacuations = evacuationData.evacuations
          .map(
            (evacuation) =>
              EVACUATIONS_MAP[evacuation as EvacuationDTOEvacuationsEnum],
          )
          .filter(Boolean)
          .join(', ');
        if (evacuations) items.push(`배변 처리 방식: ${evacuations}`);
      }

      if (evacuationData.evacuationNote) {
        items.push(`기타 배변 처리: ${evacuationData.evacuationNote}`);
      }

      return items.length > 0 ? items : ['데이터 없음'];
    }
    return ['데이터 없음'];
  };

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

  return (
    <SectionContainer title="자립생활 역량" variant="accent">
      {/* 의사소통 정도 - 2x2 그리드 */}
      <Card className="h-fit p-4 md:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-subtitle2 font-semibold">의사소통 정도</h3>
            <HistoryPopover
              historyData={communicationHistory}
              isLoading={communicationLoading}
              hasData={communicationHasData}
              formatHistoryItem={formatCommunicationHistory}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 첫 번째 행: 시력과 청력 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-1">
              <span className="text-body1 font-semibold text-grayscale-100">
                시력
              </span>
              <span
                className={cn(
                  'text-body1 font-normal',
                  independentLifeInfoData?.communication?.sights?.length
                    ? 'text-grayscale-80'
                    : 'text-grayscale-50',
                )}>
                {independentLifeInfoData?.communication?.sights
                  ?.map((sight) => SIGHTS_MAP[sight])
                  .join(', ') || '(정보 없음)'}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-body1 font-semibold text-grayscale-100">
                청력
              </span>
              <span
                className={cn(
                  'text-body1 font-normal',
                  independentLifeInfoData?.communication?.hearings?.length
                    ? 'text-grayscale-80'
                    : 'text-grayscale-50',
                )}>
                {independentLifeInfoData?.communication?.hearings
                  ?.map((hearing) => HEARINGS_MAP[hearing])
                  .join(', ') || '(정보 없음)'}
              </span>
            </div>
          </div>

          {/* 두 번째 행: 언어 소통과 한글 사용 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-1">
              <span className="text-body1 font-semibold text-grayscale-100">
                언어 소통
              </span>
              <span
                className={cn(
                  'text-body1 font-normal',
                  independentLifeInfoData?.communication?.communications
                    ? 'text-grayscale-80'
                    : 'text-grayscale-50',
                )}>
                {independentLifeInfoData?.communication?.communications
                  ? COMMUNICATIONS_MAP[
                      independentLifeInfoData.communication.communications
                    ]
                  : '(정보 없음)'}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-body1 font-semibold text-grayscale-100">
                한글 사용
              </span>
              <span
                className={cn(
                  'text-body1 font-normal',
                  independentLifeInfoData?.communication?.usingKoreans?.length
                    ? 'text-grayscale-80'
                    : 'text-grayscale-50',
                )}>
                {independentLifeInfoData?.communication?.usingKoreans
                  ?.map((korean) => USING_KOREANS_MAP[korean])
                  .join(', ') || '(정보 없음)'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 보행 | 배변 처리 */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Card className="h-full p-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-subtitle2 font-semibold">보행</h3>
              <HistoryPopover
                historyData={walkingHistory}
                isLoading={walkingLoading}
                hasData={walkingHasData}
                formatHistoryItem={formatWalkingHistory}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col space-y-1">
              <span className="text-body1 font-semibold text-grayscale-100">
                보행 여부
              </span>
              <span
                className={cn(
                  'text-body1 font-normal',
                  independentLifeInfoData?.walking?.walkingMethods?.length
                    ? 'text-grayscale-80'
                    : 'text-grayscale-50',
                )}>
                {independentLifeInfoData?.walking?.walkingMethods
                  ?.map((method) => WALKING_METHODS_MAP[method])
                  .join(', ') || '(정보 없음)'}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-body1 font-semibold text-grayscale-100">
                이동 장비
              </span>
              <span
                className={cn(
                  'text-body1 font-normal',
                  independentLifeInfoData?.walking?.walkingEquipments?.length ||
                    independentLifeInfoData?.walking?.walkingNote
                    ? 'text-grayscale-80'
                    : 'text-grayscale-50',
                )}>
                {(() => {
                  const equipments =
                    independentLifeInfoData?.walking?.walkingEquipments?.map(
                      (equipment) => WALKING_EQUIPMENTS_MAP[equipment],
                    ) || [];
                  const note = independentLifeInfoData?.walking?.walkingNote;
                  const allItems = note ? [...equipments, note] : equipments;
                  return allItems.length > 0
                    ? allItems.join(', ')
                    : '(정보 없음)';
                })()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full p-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-subtitle2 font-semibold">배변 처리</h3>
              <HistoryPopover
                historyData={evacuationHistory}
                isLoading={evacuationLoading}
                hasData={evacuationHasData}
                formatHistoryItem={formatEvacuationHistory}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col space-y-1">
              <span className="text-body1 font-semibold text-grayscale-100">
                배변 처리 방식
              </span>
              <span
                className={cn(
                  'text-body1 font-normal',
                  independentLifeInfoData?.evacuation?.evacuations?.length ||
                    independentLifeInfoData?.evacuation?.evacuationNote
                    ? 'text-grayscale-80'
                    : 'text-grayscale-50',
                )}>
                {(() => {
                  const evacuations =
                    independentLifeInfoData?.evacuation?.evacuations?.map(
                      (evacuation) => EVACUATIONS_MAP[evacuation],
                    ) || [];
                  const note =
                    independentLifeInfoData?.evacuation?.evacuationNote;
                  const allItems = note ? [...evacuations, note] : evacuations;
                  return allItems.length > 0
                    ? allItems.join(', ')
                    : '(정보 없음)';
                })()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  );
};

export default IndependentLifeSection;
