import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentItem {
  label?: string;
  value: string | React.ReactNode;
}

interface ContentCardProps {
  title: string;
  items: ContentItem[];
  hasHistory?: boolean;
  historyActive?: boolean;
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
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  items,
  hasHistory = false,
  badgeVariant,
  badgeText,
  className,
  horizontalLayout = false,
}) => {
  return (
    <Card className={cn('h-fit p-4', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-subtitle2 font-semibold">{title}</h3>
            {hasHistory && (
              <History
                className={cn(
                  'h-6 w-6',
                  'text-primary hover:text-primary/80 cursor-pointer rounded-lg bg-grayscale-5 p-[2px]',
                )}
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
