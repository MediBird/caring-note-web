import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectCellProps {
  initialValue: string;
  options: { label: string; value: string }[];
  placeholder: string;
  onValueChange: (value: string) => void;
}

function SelectCell({
  initialValue,
  options,
  placeholder,
  onValueChange,
}: SelectCellProps) {
  return (
    <div className="flex flex-col gap-1">
      <Select value={initialValue} onValueChange={onValueChange}>
        <SelectTrigger className="cursor-pointer border-none text-md">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-md">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectCell;
