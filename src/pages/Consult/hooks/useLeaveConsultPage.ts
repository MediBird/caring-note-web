import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLeaveOutDialogStore } from './store/useLeaveOutDialogStore';
import { useRecording } from '@/hooks/useRecording';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';

/**
 * 본 상담화면(/consult)에서 벗어날 때 실행되는 훅
 */
const useLeaveConsultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prevPathRef = useRef(location.pathname);
  const { openDialog } = useLeaveOutDialogStore();

  const { recordingStatus } = useRecording();

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;

    const isConsultPath = (path: string) => path.startsWith('/consult');

    const wasOnConsult = isConsultPath(prevPath);
    const isNowOnConsult = isConsultPath(currentPath);

    const isRecording =
      recordingStatus !== RecordingStatus.Ready &&
      recordingStatus !== RecordingStatus.STTCompleted &&
      recordingStatus !== RecordingStatus.AICompleted;

    if (wasOnConsult && !isNowOnConsult && isRecording) {
      console.log('원래 가려던 경로: ', currentPath);
      openDialog(currentPath);
      navigate(prevPath, { replace: true }); // 원래 페이지로 강제로 복귀
    }

    prevPathRef.current = currentPath;
  }, [location.pathname, navigate, openDialog, recordingStatus]);
};

export default useLeaveConsultPage;
