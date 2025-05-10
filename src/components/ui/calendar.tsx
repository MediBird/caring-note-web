import { buttonVariants } from '@/components/ui/buttonVariants';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import LeftArrow from '@/assets/icon/24/arrowleft.outlined.svg?react';
import RightArrow from '@/assets/icon/24/arrowright.outlined.svg?react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatCaption = (date: Date, options?: any) => {
  return format(date, 'yyyy년 LLLL', options);
};

export type CalendarProps = React.ComponentProps<typeof DayPicker>;
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  month,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={ko}
      captionLayout="dropdown"
      showOutsideDays={showOutsideDays}
      defaultMonth={month ?? new Date()}
      className={cn('', className)}
      formatters={{
        formatCaption,
      }}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center  relative items-center ',
        caption_label: 'text-body1 font-semibold',
        vhidden: 'vhidden',
        caption_dropdowns: 'flex text-base font-bold w-full gap-1 px-1',
        nav: 'space-x-1 flex items-center justify-between',
        nav_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-7 w-7 bg-transparent p-0 hover:opacity-100',
        ),
        nav_button_previous: 'w-6 h-6 [&_svg]:!text-grayscale-100',
        nav_button_next: 'w-6 h-6 [&_svg]:!text-grayscale-100',
        table: 'w-full border-collapse !mt-2',
        head_row: 'flex',
        head_cell:
          'text-neutral-500 rounded-full w-8 h-[28px] font-normal text-sm dark:text-neutral-400 content-center',
        row: 'flex w-full ',
        cell: 'h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-full  first:[&:has([aria-selected])]:rounded-full last:[&:has([aria-selected])]:rounded-full focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-neutral-800/50 dark:[&:has([aria-selected])]:bg-neutral-800',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 text-body2 font-medium aria-selected:opacity-100 rounded-full text-grayscale-80',
        ),
        day_range_end: 'day-range-end',
        day_selected:
          ' bg-primary-50 rounded-full text-white hover:bg-primary-60 hover:text-white dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50 dark:hover:text-neutral-900 dark:focus:bg-neutral-50 dark:focus:text-neutral-900',
        day_today:
          'text-grayscale-80 rounded-full border-primary-50 border-[1px]',
        day_outside:
          'day-outside text-neutral-500 aria-selected:bg-neutral-100/50 aria-selected:text-neutral-500 dark:text-neutral-400 dark:aria-selected:bg-neutral-800/50 dark:aria-selected:text-neutral-400',
        day_disabled: 'text-grayscale-40 opacity-50 dark:text-neutral-400',
        day_range_middle:
          'aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        // Dropdown: ({ value, onChange, children }: DropdownProps) => {
        //   const options = React.Children.toArray(
        //     children,
        //   ) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[];
        //   const selected = options.find((child) => child.props.value === value);
        //   const handleChange = (value: string) => {
        //     const changeEvent = {
        //       target: { value },
        //     } as React.ChangeEvent<HTMLSelectElement>;
        //     onChange?.(changeEvent);
        //   };
        //   return (
        //     <Select
        //       value={value?.toString()}
        //       onValueChange={(value) => {
        //         handleChange(value);
        //       }}>
        //       <SelectTrigger className="pr-1.5 focus:ring-0">
        //         <SelectValue>{selected?.props?.children}</SelectValue>
        //       </SelectTrigger>
        //       <SelectContent position="popper">
        //         <ScrollArea className="h-80">
        //           {options.map((option, id: number) => (
        //             <SelectItem
        //               key={`${option.props.value}-${id}`}
        //               value={option.props.value?.toString() ?? ''}>
        //               {option.props.children}
        //             </SelectItem>
        //           ))}
        //         </ScrollArea>
        //       </SelectContent>
        //     </Select>
        //   );
        // },
        Dropdown: () => null,
        IconLeft: () => (
          <span className="h-6 w-6 text-grayscale-100">
            <LeftArrow className="h-6 w-6" />
          </span>
        ),
        IconRight: () => (
          <span className="h-6 w-6 text-grayscale-100">
            <RightArrow className="h-6 w-6" />
          </span>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

const DatePickerStatusLight = () => {
  return <div>DatePickerStatusLight</div>;
};

DatePickerStatusLight.displayName = 'DatePickerStatusLight';

export { Calendar, DatePickerStatusLight };
