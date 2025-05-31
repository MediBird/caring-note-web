import completeConsult from '@/assets/home/complete-consult.webp';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CompleteConsultDialogProps {
  name?: string;
  open: boolean;
  onClose: () => void;
}

const CompleteConsultDialog = ({
  name = '',
  open,
  onClose,
}: CompleteConsultDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[480px]">
        <DialogHeader className="mt-4 h-[80px] items-center justify-center">
          <DialogTitle>
            <p className="center text-center text-h3 font-bold">
              {name}님, 고생하셨습니다! <br />
              상담 기록을 잘 보관해 둘게요.
            </p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild className="m-0 flex flex-col items-center">
          <div>
            <img
              className="mt-4 h-[240px] w-[240px]"
              src={completeConsult}
              alt="completeConsult"
            />
          </div>
        </DialogDescription>
        <DialogFooter className="m-0 flex w-full items-center justify-center p-5">
          <Button
            variant="primary"
            size="xl"
            className="w-full"
            onClick={onClose}>
            홈으로 돌아가기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteConsultDialog;
