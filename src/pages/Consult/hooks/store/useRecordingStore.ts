import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type RecordingStatusType =
  | 'idle'
  | 'recording'
  | 'paused'
  | 'stopped'
  | 'completed';

export interface RecordingState {
  recordingStatus: RecordingStatusType;
  recordedDuration: number; // seconds
  uploadProgress: number; // 0-100
  fileId: string | null; // TUS file ID from server (actually TUS URL)
  error: string | null;
  currentCounselSessionId: string | null; // 현재 활성화된 세션 ID
  currentSessionDuration: number; // 현재 세션에서의 녹음 시간
  totalDuration: number; // 전체 녹음 시간 (resume 시 누적)
}

export interface RecordingActions {
  setRecordingStatus: (status: RecordingStatusType) => void;
  setRecordedDuration: (duration: number) => void;
  incrementRecordedDuration: () => void;
  setUploadProgress: (progress: number) => void;
  setFileId: (fileId: string | null) => void;
  setError: (error: string | null) => void;
  setCurrentCounselSessionId: (counselSessionId: string | null) => void;
  setCurrentSessionDuration: (duration: number) => void;
  setTotalDuration: (duration: number) => void;
  loadStateForSession: (counselSessionId: string) => void;
  resetRecordingState: (counselSessionIdToClear?: string) => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  completeRecording: () => void;
}

export type RecordingStore = RecordingState & RecordingActions;

const baseInitialState: Pick<
  RecordingState,
  | 'recordingStatus'
  | 'recordedDuration'
  | 'uploadProgress'
  | 'fileId'
  | 'error'
  | 'currentSessionDuration'
  | 'totalDuration'
> = {
  recordingStatus: 'idle',
  recordedDuration: 0,
  uploadProgress: 0,
  fileId: null,
  error: null,
  currentSessionDuration: 0,
  totalDuration: 0,
};



export const useRecordingStore = create<RecordingStore>()(
  persist(
    (set, get) => ({
      ...baseInitialState,
      currentCounselSessionId: null,

      setRecordingStatus: (status) => set({ recordingStatus: status }),

      setRecordedDuration: (recordedDuration) => {
        set({ recordedDuration });
      },

      incrementRecordedDuration: () => {
        const current = get().recordedDuration;
        set({
          recordedDuration: current + 1,
          currentSessionDuration: get().currentSessionDuration + 1,
        });
      },

      setUploadProgress: (uploadProgress) => set({ uploadProgress }),

      setFileId: (fileId) => {
        set({ fileId });
      },

      setError: (error) => set({ error }),

      setCurrentCounselSessionId: (counselSessionId) => {
        set({ currentCounselSessionId: counselSessionId });
      },

      setCurrentSessionDuration: (duration) => {
        set({ currentSessionDuration: duration });
      },

      setTotalDuration: (duration) => {
        set({ totalDuration: duration });
      },

      loadStateForSession: (counselSessionId) => {
        if (!counselSessionId) return;

        try {
          const storageKey = `consultRecordingState_${counselSessionId}`;
          const storedStateString = localStorage.getItem(storageKey);

          if (storedStateString) {
            const storedState = JSON.parse(storedStateString);
            const newStatus: RecordingStatusType =
              storedState.fileId && storedState.recordedDuration > 0
                ? 'stopped'
                : 'idle';

            set({
              currentCounselSessionId: counselSessionId,
              recordedDuration: storedState.recordedDuration || 0,
              totalDuration:
                storedState.totalDuration || storedState.recordedDuration || 0,
              currentSessionDuration: 0,
              fileId: storedState.fileId || null,
              recordingStatus: newStatus,
              uploadProgress: 0,
              error: null,
            });
          } else {
            set({
              ...baseInitialState,
              currentCounselSessionId: counselSessionId,
            });
          }
        } catch (e) {
          console.error('Error loading state from localStorage', e);
          set({
            ...baseInitialState,
            currentCounselSessionId: counselSessionId,
          });
        }
      },

      resetRecordingState: (counselSessionIdToClear) => {
        const idToClear =
          counselSessionIdToClear || get().currentCounselSessionId;

        if (idToClear) {
          try {
            const storageKey = `consultRecordingState_${idToClear}`;
            localStorage.removeItem(storageKey);
          } catch (e) {
            console.error('Error removing state from localStorage', e);
          }
        }

        set({
          ...baseInitialState,
          currentCounselSessionId: null,
        });
      },

      startRecording: () => {
        console.log(
          '[Store] startRecording called - changing status to recording',
        );
        set({
          recordingStatus: 'recording',
          error: null,
          uploadProgress: 0,
          currentSessionDuration: 0,
        });
      },

      pauseRecording: () => {
        console.log(
          '[Store] pauseRecording called - changing status to paused',
        );
        set({ recordingStatus: 'paused' });
      },

      resumeRecording: () => {
        console.log(
          '[Store] resumeRecording called - changing status to recording',
        );
        set({ recordingStatus: 'recording' });
      },

      stopRecording: () => {
        console.log(
          '[Store] stopRecording called - changing status to stopped',
        );
        set({ recordingStatus: 'stopped' });
      },

      completeRecording: () => {
        console.log(
          '[Store] completeRecording called - changing status to completed',
        );
        set({ recordingStatus: 'completed', uploadProgress: 100 });
      },
    }),
    {
      name: 'recording-store',
      storage: createJSONStorage(() => ({
        getItem: () => null, // 기본 저장소 비활성화
        setItem: () => {},
        removeItem: () => {},
      })),
      partialize: (state) => {
        // 세션별로 중요한 상태만 저장
        if (!state.currentCounselSessionId) return {};

        const sessionKey = `consultRecordingState_${state.currentCounselSessionId}`;
        const sessionData = {
          recordedDuration: state.recordedDuration,
          totalDuration: state.totalDuration,
          fileId: state.fileId,
          recordingStatus: state.recordingStatus,
        };

        // 수동으로 세션별 localStorage에 저장
        try {
          localStorage.setItem(sessionKey, JSON.stringify(sessionData));
        } catch (e) {
          console.error('Error saving session state:', e);
        }

        return {};
      },
    },
  ),
);
