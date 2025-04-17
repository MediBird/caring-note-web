import PlusBlueIcon from '@/assets/icon/24/add.outlined.blue.svg?react';

const AddTableRowButton = ({
  onClickAddButton,
}: {
  onClickAddButton: () => void;
}) => {
  return (
    <span
      className="sticky left-1 inline-flex h-full items-center gap-[10px] hover:cursor-pointer"
      onClick={onClickAddButton}>
      <PlusBlueIcon
        className="inline-block"
        width={24}
        height={24}></PlusBlueIcon>
      <span className="text-body1 text-primary-50">추가하기</span>
    </span>
  );
};

export default AddTableRowButton;
