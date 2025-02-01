import {
  MediaRecorderStatus,
  RecordingFileInfo,
  RecordingStatus,
} from '@/types/Recording.enum';
import { useRef } from 'react';
import { create } from 'zustand';

// store (ONLY for this hook)
const useRecordingStore = create<RecordingState>((set) => ({
  recordingStatus: RecordingStatus.Ready,
  updateRecordingStatus: (newStatus: RecordingStatus) =>
    set({ recordingStatus: newStatus }),
}));

// hook's state
interface RecordingState {
  recordingStatus: RecordingStatus;
  updateRecordingStatus: (newStatus: RecordingStatus) => void;
}

// hook
export const useRecording = () => {
  const { recordingStatus, updateRecordingStatus } = useRecordingStore();

  // MediaRecorder 인스턴스를 저장하는 ref
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // 녹음된 데이터(청크)를 저장하는 ref
  const audioChunksRef = useRef<Blob[]>([]);

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
      };

      // 일시정지 이벤트 정의
      mediaRecorder.onpause = () => {
        updateRecordingStatus(RecordingStatus.Paused);
      };

      // 재개 이벤트 정의
      mediaRecorder.onresume = () => {
        updateRecordingStatus(RecordingStatus.Recording);
      };

      // 녹음 정지 이벤트 정의
      mediaRecorder.onstop = () => {
        updateRecordingStatus(RecordingStatus.Stopped);

        // 녹음된 데이터(Blob) 생성
        const audioBlob = new Blob(audioChunksRef.current, {
          type: RecordingFileInfo.Type,
        });

        // Blob을 File 객체로 변환
        const audioFile = new File(
          [audioBlob],
          RecordingFileInfo.DownloadName,
          {
            type: RecordingFileInfo.Type,
            lastModified: Date.now(),
          },
        );

        // audioFile을 이용하여 파일 업로드, 다운로드 등 원하는 작업을 수행할 수 있음.
        console.log('audioFile created!!', audioFile);

        // TEST : 만들어진 audioFile 다운로드
        const audioUrl = URL.createObjectURL(audioFile);
        const downloadLink = document.createElement('a');
        downloadLink.href = audioUrl;
        downloadLink.download = RecordingFileInfo.DownloadName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(audioUrl);
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

  const getRecordingStatus: RecordingStatus = recordingStatus;

  return {
    startRecording,
    pauseRecording,
    stopRecording,
    getRecordingStatus,
  };
};
