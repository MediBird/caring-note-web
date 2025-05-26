import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SAVE_STATUS } from '@/pages/Consult/components/interventionEditor/useInterventionEditor';
import { XIcon } from 'lucide-react';
import { forwardRef, MutableRefObject } from 'react';

interface EditorSaveDialogProps {
  onSave: () => void;
  setSaveStatus: (status: SAVE_STATUS) => void;
  savedByMainWindowRef?: MutableRefObject<boolean>;
}

const EditorSaveDialog = forwardRef<HTMLButtonElement, EditorSaveDialogProps>(
  ({ onSave, setSaveStatus, savedByMainWindowRef }, ref) => {
    const handleCloseWithoutSave = () => {
      if (savedByMainWindowRef) {
        savedByMainWindowRef.current = true;
      }
      setSaveStatus('SAVED');
      window.close();
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={ref} size="xl" variant="secondary">
            창 닫기
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[400px]">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>저장이 필요한 내용이 있습니다</DialogTitle>
            <DialogClose
              asChild
              className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
              <XIcon />
            </DialogClose>
          </DialogHeader>
          <div className="h-[1px] bg-grayscale-20" />
          <DialogDescription>
            창을 닫기 전에 현재 작성하신 내용을 유지하고 싶으시면 저장을 진행해
            주세요.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="secondary"
                size="md"
                onClick={handleCloseWithoutSave}>
                저장 없이 닫기
              </Button>
            </DialogClose>
            <Button variant="primary" size="md" onClick={onSave}>
              저장하고 닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

export default EditorSaveDialog;
