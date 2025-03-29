import { AICounselSummaryControllerApi } from '@/api';
import { useSendSpeakersQuery } from '@/pages/Consult/hooks/query/counselRecording/useSendSpeakersQuery';
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import {
  MediaRecorderStatus,
  RecordingFileInfo,
  RecordingStatus,
} from '@/pages/Consult/types/Recording.enum';
import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';

const now = format(new Date(), 'yyyyMMdd_HHmmss');

// helper functions
const updateRecordingStatus = (newStatus: RecordingStatus) => {
  useRecordingStore.setState({ recordingStatus: newStatus });
};

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

const downloadRecording = (audioFile: File) => {
  const audioUrl = URL.createObjectURL(audioFile);
  const downloadLink = document.createElement('a');
  downloadLink.href = audioUrl;
  downloadLink.download =
    RecordingFileInfo.DownloadName +
    '_' +
    now +
    RecordingFileInfo.FileExtension;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(audioUrl);
};

// hook
export const useRecording = (counselSessionId: string | undefined = '') => {
  const mediaRecorderRef = useRecordingStore((state) => state.mediaRecorderRef);
  const audioChunksRef = useRecordingStore((state) => state.audioChunksRef);

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

  const stopRecording = async () => {
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

    const audioFile = new File(
      [audioBlob],
      RecordingFileInfo.DownloadName +
        '_' +
        now +
        RecordingFileInfo.FileExtension,
      {
        type: RecordingFileInfo.Type,
        lastModified: Date.now(),
      },
    );
    downloadRecording(audioFile);

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

  const submitRecordingForLeavingOut = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const audioBlob = new Blob(audioChunksRef.current, {
      type: RecordingFileInfo.Type,
    });

    const audioFile = new File(
      [audioBlob],
      RecordingFileInfo.DownloadName +
        '_' +
        now +
        RecordingFileInfo.FileExtension,
      {
        type: RecordingFileInfo.Type,
        lastModified: Date.now(),
      },
    );
    // downloadRecording(audioFile);

    try {
      await aiCounselSummaryControllerApi.convertSpeechToText(audioFile, {
        counselSessionId,
      });
    } catch (error) {
      console.error(error);
    }

    updateRecordingStatus(RecordingStatus.Ready);
  };

  return {
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    submitRecording,
    submitRecordingForLeavingOut,
    submitSpeakers,
  };
};
