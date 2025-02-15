import PlusBlueIcon from '@/assets/icon/24/add.outlined.blue.svg?react';

const AddTableRowButton = ({
  onClickAddButton,
}: {
  onClickAddButton: () => void;
}) => {
  return (
    <div
      className="flex items-center hover:cursor-pointer gap-[10px]"
      onClick={onClickAddButton}>
      <PlusBlueIcon
        className="inline-block"
        width={24}
        height={24}></PlusBlueIcon>
      <span className="text-body1 text-primary-50 ">추가하기</span>
    </div>
  );
};

export default AddTableRowButton;
