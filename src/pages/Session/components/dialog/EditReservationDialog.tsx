import { SelectCounselSessionListItem } from '@/api/api';
import { Button } from '@/components/ui/button';
import DatePickerComponent from '@/components/ui/datepicker';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import TimepickerComponent from '@/components/ui/time-picker';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { AlertCircle, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUpdateCounselSession } from '../../hooks/query/useCounselSessionQuery';
import {
  combineToFormattedDateTime,
  extractDateTimeFromIso,
} from '../../utils/dateTimeUtils';
import CounseleeSearchInput from './CounseleeSearchInput';
import { cn } from '@/lib/utils';

interface EditReservationDialogProps {
  session: SelectCounselSessionListItem;
  triggerComponent?: React.ReactNode;
}

export const EditReservationDialog = ({
  session,
  triggerComponent,
}: EditReservationDialogProps) => {
  const [counseleeId, setCounseleeId] = useState('');
  const [counseleeName, setCounselee] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // 상담 세션 업데이트 뮤테이션
  const updateCounselSession = useUpdateCounselSession();

  // 수정 모드에서 상세 정보 로드
  useEffect(() => {
    if (session) {
      // 내담자 정보 설정
      setCounselee(session.counseleeName || '');
      setCounseleeId(session.counseleeId || '');
      setSessionId(session.counselSessionId || '');

      // 날짜와 시간 설정
      if (session.scheduledDate && session.scheduledTime) {
        // 날짜와 시간을 결합하여 Date 객체 생성
        const [year, month, day] = session.scheduledDate.split('-').map(Number);
        const [hours, minutes] = session.scheduledTime.split(':').map(Number);
        const dateWithTime = new Date(year, month - 1, day, hours, minutes);

        const { date, time } = extractDateTimeFromIso(
          dateWithTime.toISOString(),
        );

        setSessionDate(date);
        setSessionTime(time);
      }
    }
  }, [session]);

  // 폼 유효성 검증
  const validateForm = (): boolean => {
    if (!counseleeId) {
      setError('내담자를 선택해주세요.');
      return false;
    }

    if (!sessionDate) {
      setError('상담 일자를 선택해주세요.');
      return false;
    }

    if (!sessionTime) {
      setError('상담 시간을 선택해주세요.');
      return false;
    }

    setError(null);
    return true;
  };

  // 폼 제출 처리
  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // 날짜와 시간 결합 (ISO 형식)
      const scheduledDateTime = combineToFormattedDateTime(
        sessionDate,
        sessionTime,
      );

      if (!scheduledDateTime) {
        setError('날짜와 시간 형식이 유효하지 않습니다.');
        return;
      }

      if (sessionId) {
        // 상담 세션 수정
        await updateCounselSession.mutateAsync({
          counselSessionId: sessionId,
          counseleeId: counseleeId,
          scheduledStartDateTime: scheduledDateTime,
        });
        console.log('상담 일정이 수정되었습니다.');
        // 성공 후 다이얼로그 닫기
        setDialogOpen(false);
      } else {
        setError('수정할 상담 세션 정보가 없습니다.');
        return;
      }
    } catch (error) {
      console.error('상담 일정 처리 중 오류가 발생했습니다:', error);
      setError('상담 일정 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 내담자 선택 처리
  const handleCounseleeChange = (id: string, name: string) => {
    setCounseleeId(id);
    setCounselee(name);
    if (error && !id) {
      setError('내담자를 선택해주세요.');
    } else if (error === '내담자를 선택해주세요.') {
      setError(null);
    }
  };

  // 대화상자 상태 변경 처리
  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);

    // 대화상자가 닫힐 때 에러 초기화
    if (!open) {
      setError(null);
      setIsSubmitting(false);

      // 포커스 관리: 다이얼로그가 닫힐 때 트리거 요소로 포커스 돌려주기
      setTimeout(() => {
        const triggerElement = document.querySelector('[data-state="closed"]');
        if (triggerElement instanceof HTMLElement) {
          triggerElement.focus();
        }
      }, 0);
    }
  };

  // 에러 메시지가 있을 경우 자동으로 스크롤
  useEffect(() => {
    if (error) {
      const errorElement = document.getElementById('edit-reservation-error');
      errorElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [error]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange} modal={true}>
      {triggerComponent ? (
        <DialogTrigger asChild data-trigger-id="edit-reservation-trigger">
          {triggerComponent}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild data-trigger-id="edit-reservation-trigger">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setDialogOpen(true);
            }}>
            수정하기
          </DropdownMenuItem>
        </DialogTrigger>
      )}
      <DialogContent
        className="w-[464px]"
        // 포커스 관리 및 접근성 개선
        onEscapeKeyDown={() => setDialogOpen(false)}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          const triggerElement = document.querySelector(
            '[data-trigger-id="edit-reservation-trigger"]',
          );
          if (triggerElement instanceof HTMLElement) {
            setTimeout(() => triggerElement.focus(), 0);
          }
        }}>
        <DialogHeader>
          <DialogTitle>상담 일정 수정</DialogTitle>
          <DialogDescription className="text-sm text-grayscale-60"></DialogDescription>
          <DialogClose
            asChild
            className="absolute right-4 top-4 !mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <div className="grid gap-5 px-5 py-6">
          {/* 에러 메시지 */}
          {error && (
            <div
              id="edit-reservation-error"
              className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* 내담자 */}
          <div className="grid gap-2">
            <label htmlFor="counselee" className="text-sm font-medium">
              내담자<span className="ml-1 text-red-500">*</span>
            </label>
            <CounseleeSearchInput
              value={counseleeName}
              selectedId={counseleeId}
              onChange={handleCounseleeChange}
              forceClose={dialogOpen}
            />
          </div>

          {/* 상담 일자 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <label htmlFor="sessionDate" className="text-sm font-medium">
                상담 일자<span className="ml-1 text-red-500">*</span>
              </label>
              <DatePickerComponent
                align="start"
                className={cn(
                  'h-full w-full rounded border border-grayscale-30 p-2 !text-base font-medium text-grayscale-40',
                  sessionDate && 'text-grayscale-90',
                )}
                selectedMonth={sessionDate ? new Date(sessionDate) : new Date()}
                initialDate={sessionDate ? new Date(sessionDate) : undefined}
                placeholder="상담 일자 선택"
                showBorderWithOpen={true}
                handleClicked={(date) => {
                  if (date) {
                    const formattedDate = date.toISOString().split('T')[0];
                    setSessionDate(formattedDate);
                    if (error === '상담 일자를 선택해주세요.') {
                      setError(null);
                    }
                    // DatePicker가 닫힐 때 DialogContent로 포커스 이동
                    const dialogContent =
                      document.querySelector('[role="dialog"]');
                    if (dialogContent instanceof HTMLElement) {
                      setTimeout(() => dialogContent.focus(), 0);
                    }
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="sessionTime" className="text-sm font-medium">
                예약 시간<span className="ml-1 text-red-500">*</span>
              </label>
              <TimepickerComponent
                placeholder={sessionTime || '예약 시각 선택'}
                handleClicked={(time: string | undefined) => {
                  setSessionTime(time || '');
                  if (error === '상담 시간을 선택해주세요.') {
                    setError(null);
                  }
                  // TimePicker가 닫힐 때 DialogContent로 포커스 이동
                  const dialogContent =
                    document.querySelector('[role="dialog"]');
                  if (dialogContent instanceof HTMLElement) {
                    setTimeout(() => dialogContent.focus(), 0);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '처리 중...' : '수정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
