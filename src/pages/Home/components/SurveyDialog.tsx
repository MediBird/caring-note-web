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
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddCounselCardReqCardRecordStatusEnum } from '@/api/api';

interface SurveyDialogProps {
  dialogState: AddCounselCardReqCardRecordStatusEnum;
  counselSessionId: string;
}

function SurveyDialog({ dialogState, counselSessionId }: SurveyDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleStartSurvey = () => {
    navigate(`/survey/${counselSessionId}`);
  };

  const buttonConfig = {
    [AddCounselCardReqCardRecordStatusEnum.Unrecorded]: {
      variant: 'primary' as const,
      text: '카드 작성',
    },
    [AddCounselCardReqCardRecordStatusEnum.Recording]: {
      variant: 'secondary' as const,
      text: '작성 중',
    },
    [AddCounselCardReqCardRecordStatusEnum.Recorded]: {
      variant: 'primary' as const,
      text: '작성 완료',
    },
  };

  const renderTriggerButton = () => (
    <Button
      type="button"
      variant={buttonConfig[dialogState].variant}
      disabled={dialogState === AddCounselCardReqCardRecordStatusEnum.Recorded}>
      {buttonConfig[dialogState].text}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{renderTriggerButton()}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>기초 설문을 작성하시겠어요?</DialogTitle>
          <DialogClose
            asChild
            className="cursor-pointer border-none bg-transparent text-grayscale-100 !mt-0 !p-0 w-6 h-6">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription className="sm:justify-start">
          상담 경험이 있는 내담자는 이런 기록이 적혀 있습니다.
        </DialogDescription>
        <DialogFooter className="sm:justify-end">
          <div>
            <DialogClose asChild>
              <Button variant="secondary" className="mx-[0.5rem]">
                취소
              </Button>
            </DialogClose>
            <Button
              variant="primary"
              className="mx-[0.5rem]"
              onClick={handleStartSurvey}>
              작성하기
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SurveyDialog;
