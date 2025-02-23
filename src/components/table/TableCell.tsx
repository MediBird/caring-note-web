import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TableCellProps {
  text: string;
}

export const TableCell = ({ text }: TableCellProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <div className="truncate text-left">
            {text}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs break-words">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};