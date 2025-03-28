import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import { create } from 'zustand';

interface RecordingState {
  recordingStatus: RecordingStatus;
  recordingTime: number;
  recordingIntervalId: number | null;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  audioChunksRef: React.MutableRefObject<Blob[]>;
}

export const useRecordingStore = create<RecordingState>(() => ({
  recordingStatus: RecordingStatus.Ready,
  recordingTime: 0,
  recordingIntervalId: null,
  mediaRecorderRef: { current: null },
  audioChunksRef: { current: [] },
}));
