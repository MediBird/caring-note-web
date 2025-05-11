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
import { useAuthContext } from '@/context/AuthContext';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCounselAssign } from '../../hooks/query/useCounselAssign';
import { SelectCounselSessionListItemStatusEnum } from '@/api';
import useUpdateCounselSessionStatus from '@/hooks/useUpdateCounselSessionStatus';

interface AssignDialogProps {
  counselSessionId: string;
  counselorId: string;
  isCounselorAssign?: boolean;
  currentCounselorName?: string;
  status: SelectCounselSessionListItemStatusEnum;
}

// TODO: counselorId 활용 상담 담당 약사 할당 다이얼로그 구현 필요

function AssignDialog({
  counselSessionId,
  counselorId,
  isCounselorAssign,
  currentCounselorName,
  status,
}: AssignDialogProps) {
  const { user } = useAuthContext();
  const { mutate: assignMutate } = useCounselAssign();
  const { mutate: updateStatusMutate } = useUpdateCounselSessionStatus({
    counselSessionId,
  });

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActuallyAssigned = counselorId && counselorId !== '';
  const isAssignedToMe = isActuallyAssigned && counselorId === user?.id;

  const dialogState = {
    UNASSIGNED: !isActuallyAssigned,
    ASSIGNED_TO_ME: isAssignedToMe,
    ASSIGNED_TO_OTHER: isActuallyAssigned && !isAssignedToMe,
  };

  const dialogContent = {
    title: {
      UNASSIGNED: '이 상담을 담당하시겠어요?',
      ASSIGNED_TO_ME: '상담을 시작하시겠어요?',
      ASSIGNED_TO_OTHER: '이미 할당된 상담이에요',
    },
    description: {
      UNASSIGNED: '본인을 담당 약사로 지정하고 상담을 시작할 수 있습니다.',
      ASSIGNED_TO_ME: '나에게 할당된 상담입니다.',
      ASSIGNED_TO_OTHER: `${
        currentCounselorName ?? '동료'
      } 약사님이 상담을 이미 담당하고 있습니다.`,
    },
  };

  const handleStartConsult = () => {
    if (status === SelectCounselSessionListItemStatusEnum.Scheduled) {
      updateStatusMutate(SelectCounselSessionListItemStatusEnum.InProgress);
    }
    navigate(`/consult/${counselSessionId}`);
  };

  const handleAssignAndConsult = () => {
    assignMutate(
      {
        counselSessionId,
        counselorId: user?.id as string,
      },
      {
        onSuccess: () => {
          handleStartConsult();
          setOpen(false);
        },
      },
    );
  };

  const handleAssign = () => {
    assignMutate(
      {
        counselSessionId,
        counselorId: user?.id as string,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  const renderTriggerButton = () => (
    <Button
      type="button"
      className="w-full"
      size="md"
      variant={!isCounselorAssign ? 'primary' : 'secondary'}
      disabled={status === SelectCounselSessionListItemStatusEnum.Completed}>
      {status === SelectCounselSessionListItemStatusEnum.InProgress
        ? '상담 중'
        : status === SelectCounselSessionListItemStatusEnum.Completed
          ? '상담 완료됨'
          : isAssignedToMe
            ? '상담 시작'
            : isCounselorAssign
              ? `할당 완료`
              : '나에게 할당'}
    </Button>
  );

  const renderActionButtons = () => {
    if (dialogState.UNASSIGNED) {
      return (
        <div className="flex w-full justify-between gap-3">
          <Button type="button" variant="secondary" onClick={handleAssign}>
            나에게 할당하기
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleAssignAndConsult}>
            할당하고 상담하기
          </Button>
        </div>
      );
    }
    if (dialogState.ASSIGNED_TO_ME) {
      return (
        <Button type="button" variant="primary" onClick={handleStartConsult}>
          상담 시작하기
        </Button>
      );
    }
    return (
      <Button type="button" variant="primary" onClick={handleAssign}>
        나에게 할당하기
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{renderTriggerButton()}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>
            {dialogState.UNASSIGNED && dialogContent.title.UNASSIGNED}
            {dialogState.ASSIGNED_TO_ME && dialogContent.title.ASSIGNED_TO_ME}
            {dialogState.ASSIGNED_TO_OTHER &&
              dialogContent.title.ASSIGNED_TO_OTHER}
          </DialogTitle>
          <DialogClose
            asChild
            className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription>
          {dialogState.UNASSIGNED && dialogContent.description.UNASSIGNED}
          {dialogState.ASSIGNED_TO_ME &&
            dialogContent.description.ASSIGNED_TO_ME}
          {dialogState.ASSIGNED_TO_OTHER &&
            dialogContent.description.ASSIGNED_TO_OTHER}
        </DialogDescription>
        <DialogFooter>
          {renderActionButtons() && <div>{renderActionButtons()}</div>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssignDialog;
