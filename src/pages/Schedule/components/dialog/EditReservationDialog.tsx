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
import TimepickerComponent from '@/components/ui/time-picker';
import { AlertCircle, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUpdateCounselSession } from '../../hooks/query/useCounselSessionQuery';
import { useCounselSessionDetailStore } from '../../hooks/store/useCounselSessionStore';
import {
  combineToIsoDateTime,
  extractDateTimeFromIso,
} from '../../utils/dateTimeUtils';
import CounseleeSearchInput from './CounseleeSearchInput';

interface EditReservationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sessionData: SelectCounselSessionListItem;
}

export const EditReservationDialog = ({
  isOpen,
  onOpenChange,
  sessionData,
}: EditReservationDialogProps) => {
  // 로컬 상태
  const [counseleeId, setCounseleeId] = useState('');
  const [counseleeName, setCounselee] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 상담 세션 상세 정보 저장소
  const { setDetail, resetDetail } = useCounselSessionDetailStore();

  // 상담 세션 업데이트 뮤테이션
  const updateCounselSession = useUpdateCounselSession();

  // 수정 모드에서 상세 정보 로드
  useEffect(() => {
    if (isOpen && sessionData) {
      // 내담자 정보 설정
      setCounselee(sessionData.counseleeName || '');
      setCounseleeId(sessionData.counseleeId || '');

      // 날짜와 시간 설정
      if (sessionData.scheduledDate) {
        const { date, time } = extractDateTimeFromIso(
          sessionData.scheduledDate,
        );
        setSessionDate(date);
        setSessionTime(time);
      }

      // 상세 정보 저장
      setDetail(sessionData);
    }
  }, [isOpen, sessionData, setDetail]);

  // 대화상자 상태 변경 처리
  const handleOpenChange = (open: boolean) => {
    // 부모 컴포넌트에 상태 변경 알림
    onOpenChange(open);

    // 대화상자가 닫힐 때 상태 초기화
    if (!open) {
      resetFormFields();
      resetDetail();
    }
  };

  // 폼 필드 초기화
  const resetFormFields = () => {
    setCounselee('');
    setCounseleeId('');
    setSessionDate('');
    setSessionTime('');
    setError(null);
    setIsSubmitting(false);
  };

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
      const scheduledDateTime = combineToIsoDateTime(sessionDate, sessionTime);

      if (!scheduledDateTime) {
        setError('날짜와 시간 형식이 유효하지 않습니다.');
        return;
      }

      if (sessionData?.counselSessionId) {
        // 상담 세션 수정
        await updateCounselSession.mutateAsync({
          counselSessionId: sessionData.counselSessionId,
          counseleeId: counseleeId,
          scheduledStartDateTime: scheduledDateTime,
        });
        console.log('상담 일정이 수정되었습니다.');
      } else {
        setError('수정할 상담 세션 정보가 없습니다.');
        return;
      }

      // 대화상자 닫기
      handleOpenChange(false);
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

  // 에러 메시지가 있을 경우 자동으로 스크롤
  useEffect(() => {
    if (error) {
      const errorElement = document.getElementById('edit-reservation-error');
      errorElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [error]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[31.25rem]">
        <DialogHeader>
          <DialogTitle>상담 일정 수정</DialogTitle>
          <DialogDescription className="text-sm text-grayscale-60">
            상담 일정을 수정합니다.
          </DialogDescription>
          <DialogClose
            asChild
            className="cursor-pointer border-none bg-transparent text-grayscale-100 !mt-0 !p-0 w-6 h-6 absolute right-4 top-4">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <div className="grid gap-5 px-5 py-6">
          {/* 에러 메시지 */}
          {error && (
            <div
              id="edit-reservation-error"
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* 내담자 */}
          <div className="grid gap-2">
            <label htmlFor="counselee" className="text-sm font-medium">
              내담자<span className="text-red-500 ml-1">*</span>
            </label>
            <CounseleeSearchInput
              value={counseleeName}
              selectedId={counseleeId}
              onChange={handleCounseleeChange}
            />
          </div>

          {/* 상담 일자 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <label htmlFor="sessionDate" className="text-sm font-medium">
                상담 일자<span className="text-red-500 ml-1">*</span>
              </label>
              <DatePickerComponent
                className="border border-grayscale-30"
                selectedMonth={sessionDate ? new Date(sessionDate) : new Date()}
                enabledDates={[]}
                handleClicked={(date) => {
                  if (date) {
                    const formattedDate = date.toISOString().split('T')[0];
                    setSessionDate(formattedDate);
                    if (error === '상담 일자를 선택해주세요.') {
                      setError(null);
                    }
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="sessionTime" className="text-sm font-medium">
                예약 시간<span className="text-red-500 ml-1">*</span>
              </label>
              <TimepickerComponent
                handleClicked={(time: string | undefined) => {
                  setSessionTime(time || '');
                  if (error === '상담 시간을 선택해주세요.') {
                    setError(null);
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
