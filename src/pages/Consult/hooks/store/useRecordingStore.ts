import { create } from 'zustand';
import {
  saveRecordingBlob,
  loadRecordingBlob,
  deleteRecordingBlob,
  isIndexedDBSupported,
  saveRecordingBlobFallback,
  loadRecordingBlobFallback,
  cleanupOldRecordings,
} from '../../utils/recordingStorage';

export type RecordingStatus =
  | 'idle'
  | 'recording'
  | 'paused'
  | 'stopped'
  | 'uploading'
  | 'processing'
  | 'completed';

export interface RecordingState {
  recordingStatus: RecordingStatus;
  recordedDuration: number; // 현재 세션 기록 시간
  totalDuration: number; // 전체 기록 시간
  currentSessionDuration: number; // 현재 진행 중인 세션 시간
  uploadProgress: number; // 0-100
  fileId: string | null;
  currentCounselSessionId: string | null;
  error: string | null;
  aiSummaryStatus: string | null; // AI 요약 상태 ('STT_PROGRESS', 'STT_COMPLETED', 'GPT_PROGRESS', 'GPT_COMPLETED' 등)
  recordedBlob: Blob | null; // 녹음된 파일 데이터 (저장 버튼을 위해)
}

export interface RecordingActions {
  // 기본 액션
  setRecordingStatus: (status: RecordingStatus) => void;
  setRecordedDuration: (duration: number) => void;
  setTotalDuration: (duration: number) => void;
  setCurrentSessionDuration: (duration: number) => void;
  setUploadProgress: (progress: number) => void;
  setFileId: (fileId: string | null) => void;
  setCurrentCounselSessionId: (id: string | null) => void;
  setError: (error: string | null) => void;
  setAiSummaryStatus: (status: string | null) => void;
  setRecordedBlob: (blob: Blob | null) => void;

  // 저장소 관련 액션
  saveRecordingToStorage: (
    counselSessionId: string,
    blob: Blob,
    duration: number,
  ) => Promise<void>;
  loadRecordingFromStorage: (counselSessionId: string) => Promise<boolean>;
  deleteRecordingFromStorage: (counselSessionId: string) => Promise<void>;

  // 복합 액션
  incrementRecordedDuration: () => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  startUploading: () => void;
  startProcessing: () => void; // AI 요약 처리 시작
  completeRecording: () => void;
  resetRecordingState: (counselSessionId?: string) => Promise<void>;
  loadStateForSession: (counselSessionId: string) => Promise<void>;
  initializeApp: () => Promise<void>;
}

export type RecordingStore = RecordingState & RecordingActions;

const INITIAL_STATE: RecordingState = {
  recordingStatus: 'idle',
  recordedDuration: 0,
  totalDuration: 0,
  currentSessionDuration: 0,
  uploadProgress: 0,
  fileId: null,
  currentCounselSessionId: null,
  error: null,
  aiSummaryStatus: null,
  recordedBlob: null,
};

export const useRecordingStore = create<RecordingStore>((set, get) => ({
  // 초기 상태
  ...INITIAL_STATE,

  // 기본 액션
  setRecordingStatus: (status) => set({ recordingStatus: status }),
  setRecordedDuration: (duration) => set({ recordedDuration: duration }),
  setTotalDuration: (duration) => set({ totalDuration: duration }),
  setCurrentSessionDuration: (duration) =>
    set({ currentSessionDuration: duration }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setFileId: (fileId) => set({ fileId }),
  setCurrentCounselSessionId: (id) => set({ currentCounselSessionId: id }),
  setError: (error) => set({ error }),
  setAiSummaryStatus: (status) => set({ aiSummaryStatus: status }),
  setRecordedBlob: (blob) => set({ recordedBlob: blob }),

  // 저장소 관련 액션
  saveRecordingToStorage: async (counselSessionId, blob, duration) => {
    try {
      if (isIndexedDBSupported()) {
        await saveRecordingBlob(counselSessionId, blob, duration);
      } else {
        await saveRecordingBlobFallback(counselSessionId, blob, duration);
      }
    } catch (error) {
      console.error('녹음 파일 저장 실패:', error);
      // 에러 발생해도 메모리에는 유지
    }
  },

  loadRecordingFromStorage: async (counselSessionId) => {
    try {
      let recordingData;

      if (isIndexedDBSupported()) {
        recordingData = await loadRecordingBlob(counselSessionId);
      } else {
        recordingData = await loadRecordingBlobFallback(counselSessionId);
      }

      if (recordingData) {
        set({
          recordedBlob: recordingData.blob,
          totalDuration: recordingData.duration,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('녹음 파일 로드 실패:', error);
      return false;
    }
  },

  deleteRecordingFromStorage: async (counselSessionId) => {
    try {
      if (isIndexedDBSupported()) {
        await deleteRecordingBlob(counselSessionId);
      } else {
        localStorage.removeItem(`recording_blob_${counselSessionId}`);
      }
    } catch (error) {
      console.error('녹음 파일 삭제 실패:', error);
    }
  },

  // 복합 액션
  incrementRecordedDuration: () => {
    const state = get();
    set({
      recordedDuration: state.recordedDuration + 1,
      currentSessionDuration: state.currentSessionDuration + 1,
    });
  },

  startRecording: () => {
    set({
      recordingStatus: 'recording',
      error: null,
    });
  },

  pauseRecording: () => {
    set({
      recordingStatus: 'paused',
    });
  },

  resumeRecording: () => {
    set({
      recordingStatus: 'recording',
    });
  },

  stopRecording: () => {
    set({
      recordingStatus: 'stopped',
    });
  },

  startUploading: () => {
    set({
      recordingStatus: 'uploading',
      uploadProgress: 0,
    });
  },

  startProcessing: () => {
    set({
      recordingStatus: 'processing',
      aiSummaryStatus: 'STT_PROGRESS',
    });
  },

  completeRecording: () => {
    set({
      recordingStatus: 'completed',
      uploadProgress: 100,
      aiSummaryStatus: 'COMPLETED',
    });
  },

  resetRecordingState: async (counselSessionId) => {
    const newState = { ...INITIAL_STATE };
    if (counselSessionId) {
      newState.currentCounselSessionId = counselSessionId;
    }
    set(newState);

    // localStorage에서도 제거
    if (counselSessionId) {
      localStorage.removeItem(`recording_${counselSessionId}`);

      // IndexedDB/localStorage에서 녹음 파일도 삭제
      try {
        if (isIndexedDBSupported()) {
          await deleteRecordingBlob(counselSessionId);
        } else {
          localStorage.removeItem(`recording_blob_${counselSessionId}`);
        }
      } catch (error) {
        console.error('녹음 파일 삭제 실패:', error);
      }
    }
  },

  loadStateForSession: async (counselSessionId) => {
    const state = get();

    // 이미 같은 세션이면 로드하지 않음
    if (state.currentCounselSessionId === counselSessionId) {
      return;
    }

    // 현재 상태를 localStorage에 저장 (세션 변경 전)
    if (state.currentCounselSessionId) {
      try {
        const stateToSave = {
          recordingStatus: state.recordingStatus,
          recordedDuration: state.recordedDuration,
          totalDuration: state.totalDuration,
          currentSessionDuration: state.currentSessionDuration,
          uploadProgress: state.uploadProgress,
          fileId: state.fileId,
          error: state.error,
          aiSummaryStatus: state.aiSummaryStatus,
          // recordedBlob은 저장하지 않음 (별도 저장소에서 관리)
        };
        localStorage.setItem(
          `recording_${state.currentCounselSessionId}`,
          JSON.stringify(stateToSave),
        );

        // 현재 세션의 녹음 파일도 저장
        if (state.recordedBlob && state.totalDuration > 0) {
          try {
            if (isIndexedDBSupported()) {
              await saveRecordingBlob(
                state.currentCounselSessionId,
                state.recordedBlob,
                state.totalDuration,
              );
            } else {
              await saveRecordingBlobFallback(
                state.currentCounselSessionId,
                state.recordedBlob,
                state.totalDuration,
              );
            }
          } catch (error) {
            console.warn('녹음 파일 저장 실패:', error);
          }
        }
      } catch (error) {
        console.warn('녹음 상태 저장 실패:', error);
      }
    }

    // 새로운 세션이면 상태 초기화하고 세션 ID 설정
    set({
      ...INITIAL_STATE,
      currentCounselSessionId: counselSessionId,
    });

    // localStorage에서 해당 세션의 상태 로드
    try {
      const savedState = localStorage.getItem(`recording_${counselSessionId}`);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        set({
          ...parsedState,
          currentCounselSessionId: counselSessionId,
          recordedBlob: null, // Blob은 별도로 로드
        });
      }
    } catch (error) {
      console.warn('녹음 상태 로드 실패:', error);
    }

    // IndexedDB/localStorage에서 녹음 파일 로드
    try {
      let recordingData;

      if (isIndexedDBSupported()) {
        recordingData = await loadRecordingBlob(counselSessionId);
      } else {
        recordingData = await loadRecordingBlobFallback(counselSessionId);
      }

      if (recordingData) {
        set({
          recordedBlob: recordingData.blob,
          totalDuration: recordingData.duration,
          recordingStatus: 'stopped', // 복원된 녹음은 stopped 상태
        });
        console.log(
          `녹음 파일 복원 완료: ${counselSessionId} (${recordingData.duration}초)`,
        );
      }
    } catch (error) {
      console.warn('녹음 파일 로드 실패:', error);
    }
  },

  initializeApp: async () => {
    try {
      // 오래된 녹음 파일 정리 (7일 이상)
      await cleanupOldRecordings();
      console.log('앱 초기화 완료: 오래된 녹음 파일 정리');
    } catch (error) {
      console.warn('앱 초기화 중 오류:', error);
    }
  },
}));
