import InputComponent from '@/components/common/InputComponent';
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
type InputLayoutProps = {
  inputsRef: element[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: React.ChangeEventHandler<HTMLSelectElement>;
};

const InputLayout = ({ inputsRef, onChange, onSelect }: InputLayoutProps) => {
  return (
    <div className="grid grid-cols-2">
      {inputsRef.map((element: element, index: number) => {
        return (
          <InputComponent
            key={`${element.name}${index}`}
            element={element}
            onChange={onChange}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
};
export default InputLayout;
