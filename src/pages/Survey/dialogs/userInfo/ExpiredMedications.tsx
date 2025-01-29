import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import arrowForwardIcon from '@/assets/icon/24/arrowback.outlined.black.svg';

type AgreementDetailDialogTypes = {
  isDetailOpen: boolean;
  mainOpen: () => void;
  onClose: () => void;
};

const ExpiredMedications = ({
  isDetailOpen,
  mainOpen,
  onClose,
}: AgreementDetailDialogTypes) => {
  return (
    <Dialog open={isDetailOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="h-[170px] w-[480px]">
        <DialogHeader className="justify-normal">
          <img
            src={arrowForwardIcon}
            className="pt-2 cursor-pointer"
            onClick={() => {
              mainOpen();
              onClose();
            }}
          />
          <DialogTitle>폐의약품 수거에 관한 동의</DialogTitle>
        </DialogHeader>
        <div className="text-body1 font-medium mt-[0.75rem] mb-[1.75rem] mx-[1.25rem] text-grayscale-80">
          <div className="p-5 mx-auto rounded-lg shadow-md bg-grayscale-3">
            <p className="text-sm text-grayscale-50">
              안전한 폐의약품 분리배출을 위해 귀하의 불용의약품을 폐기하시는
              것에 동의하십니까?
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ExpiredMedications;
