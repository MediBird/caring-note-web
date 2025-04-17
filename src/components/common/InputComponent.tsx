import SelectComponent from '@/components/common/SelectComponent';
import TextFieldComponent from '@/components/common/TextFieldComponent';
type option = {
  val: string;
  name: string;
};
type element = {
  type: string;
  name: string;
  label: string;
  options?: option[];
  value: string;
  placeholder?: string;
};
type InputComponentProps = {
  element: element;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: React.ChangeEventHandler<HTMLSelectElement>;
};
const InputComponent = ({
  element,
  onChange,
  onSelect,
}: InputComponentProps) => {
  switch (element.type) {
    case 'text':
      return <TextFieldComponent option={element} onChange={onChange} />;
    case 'select':
      return <SelectComponent option={element} onSelect={onSelect} />;
    case 'date':
      return;
    default:
      return <></>;
  }
};
export default InputComponent;
