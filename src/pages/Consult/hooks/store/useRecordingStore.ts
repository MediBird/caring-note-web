import { create } from 'zustand';

const LOCAL_STORAGE_PREFIX = 'consultRecordingState_';

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
}

export interface RecordingActions {
  setRecordingStatus: (status: RecordingStatusType) => void;
  setRecordedDuration: (duration: number) => void;
  incrementRecordedDuration: () => void;
  setUploadProgress: (progress: number) => void;
  setFileId: (fileId: string | null) => void;
  setError: (error: string | null) => void;
  setCurrentCounselSessionId: (counselSessionId: string | null) => void;
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
  'recordingStatus' | 'recordedDuration' | 'uploadProgress' | 'fileId' | 'error'
> = {
  recordingStatus: 'idle',
  recordedDuration: 0,
  uploadProgress: 0,
  fileId: null,
  error: null,
};

const getLocalStorageKey = (counselSessionId: string) =>
  `${LOCAL_STORAGE_PREFIX}${counselSessionId}`;

export const useRecordingStore = create<RecordingStore>((set, get) => ({
  ...baseInitialState,
  currentCounselSessionId: null,

  setRecordingStatus: (status) => set({ recordingStatus: status }),

  setRecordedDuration: (recordedDuration) => {
    set({ recordedDuration });
    const sessionId = get().currentCounselSessionId;
    if (sessionId) {
      try {
        const storedState = JSON.parse(
          localStorage.getItem(getLocalStorageKey(sessionId)) || '{}',
        );
        localStorage.setItem(
          getLocalStorageKey(sessionId),
          JSON.stringify({ ...storedState, recordedDuration }),
        );
      } catch (e) {
        console.error('Error saving recordedDuration to localStorage', e);
      }
    }
  },

  incrementRecordedDuration: () => {
    const newDuration = get().recordedDuration + 1;
    set({ recordedDuration: newDuration });
    const sessionId = get().currentCounselSessionId;
    if (sessionId) {
      try {
        const storedState = JSON.parse(
          localStorage.getItem(getLocalStorageKey(sessionId)) || '{}',
        );
        localStorage.setItem(
          getLocalStorageKey(sessionId),
          JSON.stringify({ ...storedState, recordedDuration: newDuration }),
        );
      } catch (e) {
        console.error(
          'Error saving incremented recordedDuration to localStorage',
          e,
        );
      }
    }
  },

  setUploadProgress: (uploadProgress) => set({ uploadProgress }),

  setFileId: (fileId) => {
    set({ fileId });
    const sessionId = get().currentCounselSessionId;
    if (sessionId) {
      try {
        const storedState = JSON.parse(
          localStorage.getItem(getLocalStorageKey(sessionId)) || '{}',
        );
        localStorage.setItem(
          getLocalStorageKey(sessionId),
          JSON.stringify({ ...storedState, fileId }),
        );
      } catch (e) {
        console.error('Error saving fileId to localStorage', e);
      }
    }
  },

  setError: (error) => set({ error }),

  setCurrentCounselSessionId: (counselSessionId) => {
    set({ currentCounselSessionId: counselSessionId });
  },

  loadStateForSession: (counselSessionId) => {
    if (!counselSessionId) return;
    try {
      const storedStateString = localStorage.getItem(
        getLocalStorageKey(counselSessionId),
      );
      if (storedStateString) {
        const storedState = JSON.parse(storedStateString);
        const newStatus: RecordingStatusType =
          storedState.fileId && storedState.recordedDuration > 0
            ? 'stopped'
            : 'idle';
        set({
          currentCounselSessionId: counselSessionId,
          recordedDuration: storedState.recordedDuration || 0,
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
    const idToClear = counselSessionIdToClear || get().currentCounselSessionId;
    if (idToClear) {
      try {
        localStorage.removeItem(getLocalStorageKey(idToClear));
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
    console.log('[Store] startRecording called - changing status to recording');
    set({ recordingStatus: 'recording', error: null, uploadProgress: 0 });
  },
  pauseRecording: () => {
    console.log('[Store] pauseRecording called - changing status to paused');
    set({ recordingStatus: 'paused' });
  },
  resumeRecording: () => {
    console.log(
      '[Store] resumeRecording called - changing status to recording',
    );
    set({ recordingStatus: 'recording' });
  },
  stopRecording: () => {
    console.log('[Store] stopRecording called - changing status to stopped');
    set({ recordingStatus: 'stopped' });
  },
  completeRecording: () => {
    console.log(
      '[Store] completeRecording called - changing status to completed',
    );
    set({ recordingStatus: 'completed', uploadProgress: 100 });
  },
}));
