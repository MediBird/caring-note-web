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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { History } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <SectionContainer title="자립생활 역량" variant="accent">
      {/* 의사소통 정도 - 2x2 그리드 */}
      <Card className="h-fit p-4 md:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-subtitle2 font-semibold">의사소통 정도</h3>
            <History className="text-primary hover:text-primary/80 h-6 w-6 cursor-pointer rounded-lg bg-grayscale-5 p-[2px]" />
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
              <History className="text-primary hover:text-primary/80 h-6 w-6 cursor-pointer rounded-lg bg-grayscale-5 p-[2px]" />
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
              <History className="text-primary hover:text-primary/80 h-6 w-6 cursor-pointer rounded-lg bg-grayscale-5 p-[2px]" />
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
