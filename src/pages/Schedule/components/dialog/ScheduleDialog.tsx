import counselList from '@/assets/icon/20/counsellist.filled.blue.svg';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import TimepickerComponent from '@/components/ui/timepicker';
import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  useAddCounselSession,
  useCounselorList,
  useUpdateCounselSession,
} from '../../hooks/query/useCounselSessionQuery';
import {
  useAddSessionFormStore,
  useCounselSessionDetailStore,
} from '../../hooks/store/useCounselSessionStore';
import CounseleeSearchInput from './CounseleeSearchInput';

interface ScheduleDialogProps {
  mode: 'add' | 'edit';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ScheduleDialog = ({
  mode = 'add',
  isOpen = false,
  onOpenChange,
}: ScheduleDialogProps) => {
  // 로컬 상태
  const [dialogOpen, setDialogOpen] = useState(isOpen);
  const [counseleeId, setCounseleeId] = useState('');
  const [counseleeName, setCounselee] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');

  // 상담사 목록 로드
  const { data: counselorList } = useCounselorList();

  // 상담 세션 생성/수정 뮤테이션
  const addCounselSession = useAddCounselSession();
  const updateCounselSession = useUpdateCounselSession();

  // Zustand 스토어
  const { setForm, resetForm } = useAddSessionFormStore();
  const { detail, resetDetail } = useCounselSessionDetailStore();

  // 수정 모드에서 상세 정보 로드
  useEffect(() => {
    if (mode === 'edit' && detail) {
      // 내담자 정보 설정
      setCounselee(detail.counseleeName || '');
      setCounseleeId(detail.counseleeId || '');

      // 날짜와 시간 설정
      if (detail.scheduledDate) {
        const dateTime = new Date(detail.scheduledDate);

        // 날짜 형식 (YYYY-MM-DD)
        const formattedDate = dateTime.toISOString().split('T')[0];

        // 시간 형식 (HH:MM)
        const hours = dateTime.getHours().toString().padStart(2, '0');
        const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        setSessionDate(formattedDate);
        setSessionTime(formattedTime);
      }
    } else {
      // 추가 모드에서는 기본값 설정
      setCounselee('');
      setCounseleeId('');
      setSessionDate('');
      setSessionTime('');
    }
  }, [mode, detail, isOpen]);

  // 대화상자 상태 변경 처리
  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);

    // 부모 컴포넌트에 상태 변경 알림
    if (onOpenChange) {
      onOpenChange(open);
    }

    // 대화상자가 닫힐 때 상태 초기화
    if (!open) {
      resetForm();
      if (mode === 'edit') {
        resetDetail();
      }
    }
  };

  // 폼 제출 처리
  const handleSubmit = async () => {
    // 유효성 검사
    if (!counseleeId) {
      alert('내담자를 선택해주세요.');
      return;
    }

    if (!sessionDate || !sessionTime) {
      alert('상담 일자와 시간을 선택해주세요.');
      return;
    }

    // 날짜와 시간 결합 (ISO 형식)
    const scheduledDateTime = `${sessionDate}T${sessionTime}:00`;

    try {
      if (mode === 'add') {
        // 새 상담 세션 생성
        await addCounselSession.mutateAsync({
          counseleeId: counseleeId,
          scheduledStartDateTime: scheduledDateTime,
        });
        console.log('상담 일정이 등록되었습니다.');
      } else if (detail?.counselSessionId) {
        // 상담 세션 수정
        await updateCounselSession.mutateAsync({
          counselSessionId: detail.counselSessionId,
          counseleeId: counseleeId,
          scheduledStartDateTime: scheduledDateTime,
        });
        console.log('상담 일정이 수정되었습니다.');
      }

      // 대화상자 닫기
      handleOpenChange(false);
    } catch (error) {
      console.error('상담 일정 처리 중 오류가 발생했습니다:', error);
      alert('상담 일정 처리 중 오류가 발생했습니다.');
    }
  };

  // 내담자 선택 처리
  const handleCounseleeChange = (id: string, name: string) => {
    setCounseleeId(id);
    setCounselee(name);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {mode === 'add' && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="lg">
            <img
              src={counselList}
              alt="상담 일정 등록"
              className="h-5 w-5 mr-2"
            />
            상담 일정 등록
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-[31.25rem]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? '상담 일정 등록' : '상담 일정 수정'}
          </DialogTitle>
          <DialogDescription className="text-sm text-grayscale-60">
            {mode === 'add'
              ? '새로운 상담 일정을 등록합니다.'
              : '상담 일정을 수정합니다.'}
          </DialogDescription>
          <DialogClose
            asChild
            className="cursor-pointer border-none bg-transparent text-grayscale-100 !mt-0 !p-0 w-6 h-6 absolute right-4 top-4">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <div className="grid gap-5 px-5 py-6">
          {/* 내담자 */}
          <div className="grid gap-2">
            <label htmlFor="counselee" className="text-sm font-medium">
              내담자
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
                상담 일자
              </label>
              <DatePickerComponent
                selectedMonth={sessionDate ? new Date(sessionDate) : new Date()}
                enabledDates={[]}
                onMonthChange={(date) => setSessionDate(date.toString())}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="sessionTime" className="text-sm font-medium">
                예약 시간
              </label>
              <TimepickerComponent
                handleClicked={(time: string | undefined) =>
                  setSessionTime(time || '')
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-end">
          <Button onClick={handleSubmit}>
            {mode === 'add' ? '완료' : '수정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
