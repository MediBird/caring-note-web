export type RecordingStatus =
  | 'idle'
  | 'recording'
  | 'paused'
  | 'stopped'
  | 'uploading'
  | 'processing'
  | 'completed';

export type AISummaryStatus =
  | 'IDLE'
  | 'STT_PROGRESS'
  | 'STT_COMPLETED'
  | 'GPT_PROGRESS'
  | 'GPT_COMPLETED'
  | 'COMPLETED'
  | 'ERROR';

export interface RecordingTimerState {
  recordedDuration: number;
  currentSessionDuration: number;
  totalDuration: number;
}

export interface RecordingFileData {
  blob: Blob | null;
  fileId: string | null;
  duration: number;
  isFromStorage: boolean;
}

export interface RecordingUploadState {
  progress: number;
  isUploading: boolean;
  error: string | null;
}

export interface RecordingSessionState {
  currentSessionId: string | null;
  isLoading: boolean;
  status: RecordingStatus;
  aiSummaryStatus: AISummaryStatus | null;
}

export interface RecordingControlMethods {
  start: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => Promise<void>;
  save: () => Promise<void>;
  delete: () => Promise<void>;
}

export interface MediaRecorderState {
  instance: MediaRecorder | null;
  stream: MediaStream | null;
  chunks: Blob[];
  isActive: boolean;
}

export interface StorageRecordingData {
  blob: Blob;
  timestamp: number;
  duration: number;
  mimeType: string;
}

export interface TusUploadConfig {
  endpoint: string;
  metadata: Record<string, string>;
  headers: Record<string, string>;
  chunkSize?: number;
  retryDelays?: number[];
}

export interface RecordingError extends Error {
  code: string;
  details?: unknown;
}

// Utility types for better type safety
export type RecordingAction<T = void> = () => Promise<T>;
export type RecordingCallback<T = void> = (data: T) => void;

// Constants
export const RECORDING_CONFIG = {
  MIME_TYPE: 'audio/webm',
  CHUNK_INTERVAL: 1000,
  AUTO_SAVE_INTERVAL: 30000,
  MIN_RECORDING_DURATION: 3,
  MAX_RETRIES: 3,
} as const;

export const STORAGE_KEYS = {
  RECORDING_STATE: (sessionId: string) => `recording_${sessionId}`,
  RECORDING_BLOB: (sessionId: string) => `recording_blob_${sessionId}`,
} as const;
