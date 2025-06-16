import {
  CounselCardBaseInformationResCardRecordStatusEnum,
  UpdateCounselCardStatusReqStatusEnum,
} from '@/api';
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
import { useCounselCardStatusMutation } from '@/pages/Survey/hooks/useCounselCardQuery';
import { useDetailCounselSessionStore } from '@/store/counselSessionStore';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SurveyDialogProps {
  dialogState: CounselCardBaseInformationResCardRecordStatusEnum;
  counselSessionId: string;
  counseleeId: string;
  isConsent?: boolean;
  disabled?: boolean;
}

function SurveyDialog({
  dialogState,
  counselSessionId,
  counseleeId,
  isConsent,
  disabled,
}: SurveyDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { mutate: updateStatus } = useCounselCardStatusMutation();
  const { setDetail } = useDetailCounselSessionStore();

  const handleStartSurvey = () => {
    setDetail({ counselSessionId, counseleeId });

    if (
      dialogState ===
      CounselCardBaseInformationResCardRecordStatusEnum.NotStarted
    ) {
      updateStatus({
        counselSessionId,
        status: UpdateCounselCardStatusReqStatusEnum.InProgress,
      });
    }

    if (isConsent === true) {
      navigate(`/survey/${counselSessionId}`);
    } else {
      navigate(`/survey/${counselSessionId}/consent`);
    }
  };

  const buttonConfig = {
    [CounselCardBaseInformationResCardRecordStatusEnum.NotStarted]: {
      variant: 'primary' as const,
      text: '설문 작성',
    },
    [CounselCardBaseInformationResCardRecordStatusEnum.InProgress]: {
      variant: 'secondary' as const,
      text: '작성 중',
    },
    [CounselCardBaseInformationResCardRecordStatusEnum.Completed]: {
      variant: 'secondary' as const,
      text: '작성 완료',
    },
  };

  const isTriggerDisabled =
    dialogState ===
      CounselCardBaseInformationResCardRecordStatusEnum.Completed || disabled;

  const getTriggerButtonText = () => {
    if (
      dialogState ===
      CounselCardBaseInformationResCardRecordStatusEnum.Completed
    )
      return '작성 완료';
    if (
      dialogState ===
      CounselCardBaseInformationResCardRecordStatusEnum.InProgress
    )
      return '작성 중';
    return '설문 작성';
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full"
            type="button"
            variant={buttonConfig[dialogState]?.variant || 'secondary'}
            disabled={isTriggerDisabled}>
            {getTriggerButtonText()}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>기초 설문을 작성하시겠어요?</DialogTitle>
            <DialogClose
              asChild
              className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
              <XIcon />
            </DialogClose>
          </DialogHeader>
          <div className="h-[1px] bg-grayscale-20" />
          <DialogDescription className="sm:justify-start">
            {isConsent === false &&
            dialogState ===
              CounselCardBaseInformationResCardRecordStatusEnum.NotStarted
              ? '내담자의 개인정보 수집 동의가 필요합니다.'
              : '상담 경험이 있는 내담자는 이전 기록이 적혀 있습니다.'}
          </DialogDescription>
          <DialogFooter className="sm:justify-end">
            <div className="flex items-center gap-3">
              <DialogClose asChild>
                <Button variant="secondary">취소</Button>
              </DialogClose>
              <Button variant="primary" onClick={handleStartSurvey}>
                {isConsent === false &&
                dialogState ===
                  CounselCardBaseInformationResCardRecordStatusEnum.NotStarted
                  ? '동의받기'
                  : '작성하기'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SurveyDialog;
