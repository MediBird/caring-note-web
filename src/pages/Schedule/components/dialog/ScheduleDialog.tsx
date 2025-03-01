import {
  AddCounselSessionReqStatusEnum,
  SelectCounselSessionListItem,
} from '@/api/api';
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
import { Input } from '@/components/ui/input';
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
  useCounselorListStore,
  useCounselSessionDetailStore,
} from '../../hooks/store/useCounselSessionStore';

interface ScheduleDialogProps {
  mode: 'add' | 'edit';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  counselSession?: SelectCounselSessionListItem;
}

export const ScheduleDialog = ({
  mode = 'add',
  isOpen = false,
  onOpenChange,
  counselSession,
}: ScheduleDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(isOpen);
  const [counselee, setCounselee] = useState('');
  const [counselorId, setCounselorId] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');

  // 상담사 목록 로드
  const { data: counselorList } = useCounselorList();
  const { counselors, setCounselors } = useCounselorListStore();

  // 상담 세션 생성/수정 뮤테이션
  const addCounselSession = useAddCounselSession();
  const updateCounselSession = useUpdateCounselSession();

  // 폼 상태 저장소
  const { form, setForm, resetForm } = useAddSessionFormStore();
  const { detail, setDetail } = useCounselSessionDetailStore();

  useEffect(() => {
    // 상담사 목록 저장
    if (counselorList) {
      setCounselors(counselorList);
    }
  }, [counselorList, setCounselors]);

  useEffect(() => {
    // 수정 모드일 때 기존 데이터 로드
    if (mode === 'edit' && counselSession) {
      setCounselee(counselSession.counseleeName || '');
      setCounselorId(counselSession.counselorId || '');

      // 날짜와 시간 분리 (2023-10-15T14:30:00 형식 가정)
      if (counselSession.scheduledDate) {
        const dateTime = new Date(counselSession.scheduledDate);
        const formattedDate = dateTime.toISOString().split('T')[0];

        // 시간 형식 (HH:MM)
        const hours = dateTime.getHours().toString().padStart(2, '0');
        const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        setSessionDate(formattedDate);
        setSessionTime(formattedTime);
      }

      setDetail(counselSession);
    }
  }, [mode, counselSession, setDetail]);

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }

    // 다이얼로그가 닫힐 때 폼 초기화
    if (!open) {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    // 날짜와 시간 결합
    const scheduledDateTime = `${sessionDate}T${sessionTime}:00`;

    if (mode === 'add') {
      // 새 상담 세션 생성
      addCounselSession.mutate({
        counseleeId: counselee,
        counselorId: counselorId,
        scheduledStartDateTime: scheduledDateTime,
        status: AddCounselSessionReqStatusEnum.Scheduled,
      });
    } else {
      // 상담 세션 수정
      if (detail && detail.counselSessionId) {
        updateCounselSession.mutate({
          counselSessionId: detail.counselSessionId,
          counseleeId: counselee,
          scheduledStartDateTime: scheduledDateTime,
        });
      }
    }

    // 다이얼로그 닫기
    handleOpenChange(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {mode === 'add' && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="lg">
            <img src={counselList} alt="상담 일정 등록" className="h-5 w-5" />
            상담 일정 등록
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-[31.25rem]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? '상담 일정 등록' : '상담 일정 수정'}
          </DialogTitle>
          <DialogDescription className="text-sm text-grayscale-60"></DialogDescription>
          <DialogClose
            asChild
            className="cursor-pointer border-none bg-transparent text-grayscale-100 !mt-0 !p-0 w-6 h-6">
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
            <Input
              id="counselee"
              value={counselee}
              onChange={(e) => setCounselee(e.target.value)}
              placeholder="내담자 이름"
            />
          </div>

          {/* 상담 일자 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <label htmlFor="sessionDate" className="text-sm font-medium">
                상담 일자
              </label>
              <DatePickerComponent
                selectedMonth={new Date()}
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
