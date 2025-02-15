import { AICounselSummaryControllerApi } from '@/api';
// import { useGetRecordingStatusQuery } from '@/pages/Consult/hooks/query/useGetRecordingStatusQuery';
import {
  MediaRecorderStatus,
  RecordingFileInfo,
  RecordingStatus,
} from '@/types/Recording.enum';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';

// store's state
interface RecordingState {
  recordingStatus: RecordingStatus;
  recordingTime: number;
  recordingIntervalId: number | null;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  audioChunksRef: React.MutableRefObject<Blob[]>;
}

// store (ONLY for this hook)
const useRecordingStore = create<RecordingState>(() => ({
  recordingStatus: RecordingStatus.Ready,
  recordingTime: 0,
  recordingIntervalId: null,
  mediaRecorderRef: { current: null },
  audioChunksRef: { current: [] },
}));

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
const updateRecordingStatus = (newStatus: RecordingStatus) => {
  useRecordingStore.setState({ recordingStatus: newStatus });
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

  // const {
  //   data: getRecordingStatusData,
  //   isSuccess: isSuccessGetRecordingStatus,
  // } = useGetRecordingStatusQuery(counselSessionId, recordingStatus);

  const aiCounselSummaryControllerApi = useMemo(
    () => new AICounselSummaryControllerApi(),
    [],
  );

  // useEffect(() => {
  //   if (
  //     !isSuccessGetRecordingStatus ||
  //     !getRecordingStatusData?.aiCounselSummaryStatus
  //   ) {
  //     return;
  //   }

  //   const statusMapping: { [key: string]: RecordingStatus } = {
  //     STT_COMPLETE: RecordingStatus.STTCompleted,
  //     STT_FAILED: RecordingStatus.Error,
  //     GPT_COMPLETE: RecordingStatus.AICompleted,
  //     GPT_FAILED: RecordingStatus.Error,
  //   };

  //   const status = statusMapping[getRecordingStatusData.aiCounselSummaryStatus];
  //   updateRecordingStatus(status);
  // }, [isSuccessGetRecordingStatus, getRecordingStatusData]);

  useEffect(() => {
    console.log('=== useEffect recordingStatus :', recordingStatus);
  }, [recordingStatus]);

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
    // 녹음된 데이터(Blob) 생성
    const audioBlob = new Blob(audioChunksRef.current, {
      type: RecordingFileInfo.Type,
    });

    // Blob을 File 객체로 변환
    const audioFile = new File([audioBlob], RecordingFileInfo.DownloadName, {
      type: RecordingFileInfo.Type,
      lastModified: Date.now(),
    });

    // TEST : 만들어진 audioFile 다운로드
    const audioUrl = URL.createObjectURL(audioFile);
    const downloadLink = document.createElement('a');
    downloadLink.href = audioUrl;
    downloadLink.download = RecordingFileInfo.DownloadName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(audioUrl);
    console.log('=== audioFile ===', audioFile);

    try {
      const response = await aiCounselSummaryControllerApi.convertSpeechToText(
        audioFile,
        { counselSessionId },
      );
      console.log('=== convertSpeechToText ===', response);

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
    console.log(speakers);

    // 발화자를 선택하여 AI 분석 요청
    setTimeout(() => {
      // polling 하여 AI 분석 완료 여부 확인 후 완료되면 상태를 변경
      updateRecordingStatus(RecordingStatus.AICompleted);
    }, 1500);
    updateRecordingStatus(RecordingStatus.AILoading);
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
