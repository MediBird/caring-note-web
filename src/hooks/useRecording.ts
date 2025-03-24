import { AICounselSummaryControllerApi } from '@/api';
import { useSendSpeakersQuery } from '@/pages/Consult/hooks/query/counselRecording/useSendSpeakersQuery';
import {
  MediaRecorderStatus,
  RecordingFileInfo,
  RecordingStatus,
} from '@/pages/Consult/types/Recording.enum';
import { useCallback, useMemo } from 'react';
import { create } from 'zustand';

// store's state
interface RecordingState {
  recordingStatus: RecordingStatus;
  recordingTime: number;
  recordingIntervalId: number | null;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  audioChunksRef: React.MutableRefObject<Blob[]>;
}

// store
const useRecordingStore = create<RecordingState>(() => ({
  recordingStatus: RecordingStatus.Ready,
  recordingTime: 0,
  recordingIntervalId: null,
  mediaRecorderRef: { current: null },
  audioChunksRef: { current: [] },
}));

// store's setter
export const updateRecordingStatus = (newStatus: RecordingStatus) => {
  useRecordingStore.setState({ recordingStatus: newStatus });
};

// helper functions
const addRecordingInterval = () => {
  const intervalId = setInterval(() => {
    addOneSecond();
  }, 1000);
  useRecordingStore.setState({
    recordingIntervalId: Number(intervalId),
  });
};
const clearRecordingIntervalId = () => {
  const intervalId = useRecordingStore.getState().recordingIntervalId;
  if (intervalId !== null) {
    clearInterval(intervalId);
    useRecordingStore.setState({ recordingIntervalId: null });
  }
};

const addOneSecond = () => {
  useRecordingStore.setState((state) => ({
    recordingTime: state.recordingTime + 1,
  }));
};

// hook
export const useRecording = (counselSessionId: string | undefined = '') => {
  const { recordingStatus, recordingTime, mediaRecorderRef, audioChunksRef } =
    useRecordingStore();

  // api
  const aiCounselSummaryControllerApi = useMemo(
    () => new AICounselSummaryControllerApi(),
    [],
  );
  const { sendSpeakers } = useSendSpeakersQuery();

  const startRecording = async () => {
    try {
      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 녹음 중 데이터가 발생할 때마다 청크를 저장
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 녹음 시작 이벤트 정의
      mediaRecorder.onstart = () => {
        updateRecordingStatus(RecordingStatus.Recording);

        // 타이머 세팅
        clearRecordingIntervalId();
        addRecordingInterval();
      };

      // 일시정지 이벤트 정의
      mediaRecorder.onpause = () => {
        updateRecordingStatus(RecordingStatus.Paused);

        // 타이머 중지
        clearRecordingIntervalId();
      };

      // 재개 이벤트 정의
      mediaRecorder.onresume = () => {
        updateRecordingStatus(RecordingStatus.Recording);

        // 타이머 세팅
        clearRecordingIntervalId();
        addRecordingInterval();
      };

      // 녹음 정지 이벤트 정의
      mediaRecorder.onstop = () => {
        updateRecordingStatus(RecordingStatus.Stopped);

        // 타이머 중지
        clearRecordingIntervalId();
      };

      // 녹음 시작
      mediaRecorder.start();
    } catch (error) {
      // 마이크 권한이 거부되었을 때
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        updateRecordingStatus(RecordingStatus.PermissionDenied);
        return;
      }

      updateRecordingStatus(RecordingStatus.Error);
      console.error(error);
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (mediaRecorderRef.current.state === MediaRecorderStatus.Recording) {
      mediaRecorderRef.current.pause();
    } else if (mediaRecorderRef.current.state === MediaRecorderStatus.Paused) {
      mediaRecorderRef.current.resume();
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
  };

  const resetRecording = useCallback(() => {
    clearRecordingIntervalId();
    updateRecordingStatus(RecordingStatus.Ready);
    useRecordingStore.setState({ recordingTime: 0 });
  }, []);

  const submitRecording = async () => {
    updateRecordingStatus(RecordingStatus.STTLoading);

    const audioBlob = new Blob(audioChunksRef.current, {
      type: RecordingFileInfo.Type,
    });

    const audioFile = new File([audioBlob], RecordingFileInfo.DownloadName, {
      type: RecordingFileInfo.Type,
      lastModified: Date.now(),
    });

    // FOR TEST : 만들어진 audioFile 다운로드
    const audioUrl = URL.createObjectURL(audioFile);
    const downloadLink = document.createElement('a');
    downloadLink.href = audioUrl;
    downloadLink.download = RecordingFileInfo.DownloadName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(audioUrl);

    try {
      sessionStorage.setItem('autoNavigationOpen', 'true');

      const response = await aiCounselSummaryControllerApi.convertSpeechToText(
        audioFile,
        { counselSessionId },
      );

      if (response.status === 200) {
        updateRecordingStatus(RecordingStatus.STTLoading);
      } else {
        updateRecordingStatus(RecordingStatus.Error);
      }
    } catch (error) {
      console.error(error);
      updateRecordingStatus(RecordingStatus.Error);
    }
  };

  const submitSpeakers = (speakers: string[]) => {
    sessionStorage.setItem('autoNavigationOpen', 'true');

    updateRecordingStatus(RecordingStatus.AILoading);
    sendSpeakers({ counselSessionId, speakers });
  };

  return {
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    submitRecording,
    submitSpeakers,
    recordingStatus,
    recordingTime,
  };
};
