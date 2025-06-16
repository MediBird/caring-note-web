import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SelectPreviousItemListByInformationNameAndItemNameTypeEnum } from '@/api';
import { useHistoryData } from '@/pages/Consult/hooks/query/useHistoryQuery';
import HistoryPopover from './HistoryPopover';

interface ContentItem {
  label?: string;
  value: string | React.ReactNode;
}

interface ContentCardProps {
  title: string;
  items: ContentItem[];
  hasHistory?: boolean;
  historyType?: SelectPreviousItemListByInformationNameAndItemNameTypeEnum;
  badgeVariant?:
    | 'default'
    | 'destructive'
    | 'secondary'
    | 'outline'
    | 'errorLight'
    | 'primaryLight';
  badgeText?: string;
  className?: string;
  horizontalLayout?: boolean;
  formatHistoryItem?: (data: unknown) => string[];
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  items,
  hasHistory = false,
  historyType,
  badgeVariant,
  badgeText,
  className,
  horizontalLayout = false,
  formatHistoryItem,
}) => {
  // Zustand 스토어에서 히스토리 데이터 가져오기
  const { historyData, isLoading, hasData } = useHistoryData(
    historyType ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.CounselPurposeAndNote,
  );

  return (
    <Card className={cn('h-fit p-4', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-subtitle2 font-semibold">{title}</h3>
            {hasHistory && historyType && (
              <HistoryPopover
                historyData={historyData}
                isLoading={isLoading}
                hasData={hasData}
                formatHistoryItem={formatHistoryItem}
              />
            )}
          </div>
          {badgeVariant && badgeText && (
            <Badge variant={badgeVariant}>{badgeText}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              horizontalLayout
                ? 'flex items-center justify-between'
                : 'flex flex-col space-y-1',
            )}>
            {item.label && (
              <span className="text-body1 font-semibold text-grayscale-100">
                {item.label}
              </span>
            )}
            <span
              className={cn(
                'text-body1 font-normal',
                item.value ? 'text-grayscale-80' : 'text-grayscale-50',
              )}>
              {item.value || '(정보 없음)'}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ContentCard;
