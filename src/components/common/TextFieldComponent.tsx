type option = {
  val: string;
  name: string;
};

type TextFieldComponentProps = {
  option: {
    type: string;
    name: string;
    label: string;
    options?: option[];
    value: string;
    placeholder?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const TextFieldComponent = ({ option, onChange }: TextFieldComponentProps) => {
  return (
    <div className="flex w-full justify-between">
      <label className="col-12 text-lg-right flex columns-sm pt-5">
        {option.label}
      </label>
      <div className="col-12 text-lg-right relative flex w-60 columns-sm pr-10 pt-5">
        <input
          type="text"
          name={option.name}
          className="w-40 flex-grow gap-2 px-2 py-1.5 text-left text-base font-medium text-[#1b1b1c]"
          placeholder={option.placeholder}
          value={option.value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
export default TextFieldComponent;
