import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent>
        <DialogHeader>
          <img
            src={arrowForwardIcon}
            className="cursor-pointer"
            onClick={() => {
              mainOpen();
              onClose();
            }}
          />
          <DialogTitle>폐의약품 수거에 관한 동의</DialogTitle>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription>
          <div className="p-4 mx-auto mt-2 mb-4 rounded-lg shadow-md bg-grayscale-3">
            <p className="mb-4 text-sm text-grayscale-50">
              안전한 폐의약품 분리배출을 위해 귀하의 불용의약품을 폐기하시는
              것에 동의하십니까?
            </p>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
export default ExpiredMedications;
