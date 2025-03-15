import { AddCounselCardReqCardRecordStatusEnum } from '@/api/api';
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
import { useCounseleeConsentQuery } from '@/pages/Survey/hooks/useCounseleeConsentQuery';
import { useDetailCounselSessionStore } from '@/store/counselSessionStore';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SurveyDialogProps {
  dialogState: AddCounselCardReqCardRecordStatusEnum;
  counselSessionId: string;
  counseleeId: string;
}

function SurveyDialog({
  dialogState,
  counselSessionId,
  counseleeId,
}: SurveyDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  // 내담자 개인정보 수집 동의 여부 조회
  const { data, isLoading } = useCounseleeConsentQuery(
    counselSessionId,
    counseleeId,
  );
  // 상담 세션 상세 정보 조회
  const { setDetail } = useDetailCounselSessionStore();

  // 작성하기 버튼 클릭시
  const handleStartSurvey = () => {
    setDetail({ counselSessionId, counseleeId });

    if (!isLoading && data) {
      // 동의 한사람인 경우 기초 설문 작성 페이지로 이동
      if (data.isConsent === true) {
        navigate(`/survey/${counselSessionId}`);
      } else {
        // 동의하지 않은 사람인 경우 동의 페이지로 이동
        navigate(`/survey/${counselSessionId}/consent`);
      }
    }
  };

  const buttonConfig = {
    [AddCounselCardReqCardRecordStatusEnum.NotStarted]: {
      variant: 'primary' as const,
      text: '설문 작성',
    },
    [AddCounselCardReqCardRecordStatusEnum.InProgress]: {
      variant: 'secondary' as const,
      text: '작성 중',
    },
    [AddCounselCardReqCardRecordStatusEnum.Completed]: {
      variant: 'primary' as const,
      text: '작성 완료',
    },
  };

  const renderTriggerButton = () => (
    <Button
      className="w-full"
      type="button"
      variant={buttonConfig[dialogState].variant}
      disabled={
        dialogState === AddCounselCardReqCardRecordStatusEnum.Completed
      }>
      {buttonConfig[dialogState].text}
    </Button>
  );

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{renderTriggerButton()}</DialogTrigger>
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
            상담 경험이 있는 내담자는 이전 기록이 적혀 있습니다.
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
      {/* <UserInfoDialog
        isOpen={isUserInfoOpen}
        handleOpen={() => setIsUserInfoOpen(!isUserInfoOpen)}
        counselSessionId={counselSessionId}
        counseleeId={counseleeId}
      /> */}
    </div>
  );
}

export default SurveyDialog;
