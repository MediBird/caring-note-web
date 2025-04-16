type option = {
  val: string;
  name: string;
};

type SelectComponentProps = {
  option: {
    type: string;
    name: string;
    label: string;
    options?: option[];
    value: string;
    placeholder?: string;
  };
  onSelect: React.ChangeEventHandler<HTMLSelectElement>;
};
const SelectComponent = ({ option, onSelect }: SelectComponentProps) => {
  return (
    <div className="flex w-full justify-between">
      <label className="col-12 text-lg-right flex columns-sm pt-5">
        {option.label}
      </label>
      <div className="col-12 text-lg-right flex w-60 columns-sm pr-10 pt-5">
        <select
          name={option.name}
          className="flex w-40 flex-grow gap-2 px-2 py-1.5 pr-2 text-left text-base font-medium text-[#1b1b1c]"
          value={option.value}
          onChange={onSelect}>
          {option.options?.map((element) => {
            return (
              <option key={`${element.val}`} value={element.val}>
                {element.name}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
export default SelectComponent;
