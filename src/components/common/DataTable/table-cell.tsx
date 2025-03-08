import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TableCellProps {
  text: string;
  width?: number;
  className?: string;
  textColor?: string;
}

export const TableCell = ({
  text,
  width,
  className,
  textColor,
}: TableCellProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn('w-full overflow-hidden', className)}
            style={{
              width: width ? `${width}px` : 'auto',
              maxWidth: width ? `${width}px` : 'auto',
            }}>
            <div
              className={cn('text-body1 font-medium ml-3 truncate', textColor)}>
              {text}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={20}
          className="max-w-[400px] break-words">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
