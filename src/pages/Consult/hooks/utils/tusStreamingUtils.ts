/**
 * TUS 스트리밍 업로드를 위한 유틸리티 함수들
 */

export interface ChunkInfo {
  id: string;
  blob: Blob;
  size: number;
  timestamp: number;
  uploadOffset: number;
  isUploaded: boolean;
}

export interface UploadState {
  sessionId: string;
  totalDuration: number;
  uploadUrl: string | null;
  totalSize: number;
  uploadedSize: number;
  chunks: ChunkInfo[];
  lastUploadTime: number;
}

export class TusStreamingManager {
  private chunks: Map<string, ChunkInfo> = new Map();
  private uploadState: UploadState;
  private maxRetries = 3;
  private retryDelay = 2000; // 2초

  constructor(sessionId: string, initialDuration: number = 0) {
    this.uploadState = {
      sessionId,
      totalDuration: initialDuration,
      uploadUrl: null,
      totalSize: 0,
      uploadedSize: 0,
      chunks: [],
      lastUploadTime: Date.now(),
    };
  }

  /**
   * 새 청크를 추가합니다
   */
  addChunk(blob: Blob, duration: number): ChunkInfo {
    const chunkId = `${this.uploadState.sessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const chunk: ChunkInfo = {
      id: chunkId,
      blob,
      size: blob.size,
      timestamp: Date.now(),
      uploadOffset: this.uploadState.totalSize,
      isUploaded: false,
    };

    this.chunks.set(chunkId, chunk);
    this.uploadState.chunks.push(chunk);
    this.uploadState.totalSize += blob.size;
    this.uploadState.totalDuration = duration;

    return chunk;
  }

  /**
   * 업로드할 준비가 된 청크들을 반환합니다
   */
  getChunksReadyForUpload(thresholdSizeMB: number): ChunkInfo[] {
    const thresholdSize = thresholdSizeMB * 1024 * 1024;
    const unuploadedChunks = Array.from(this.chunks.values()).filter(
      (chunk) => !chunk.isUploaded,
    );

    if (unuploadedChunks.length === 0) return [];

    const totalUnuploadedSize = unuploadedChunks.reduce(
      (acc, chunk) => acc + chunk.size,
      0,
    );

    if (totalUnuploadedSize >= thresholdSize) {
      return unuploadedChunks;
    }

    return [];
  }

  /**
   * 청크 업로드 완료를 표시합니다
   */
  markChunkUploaded(chunkId: string): void {
    const chunk = this.chunks.get(chunkId);
    if (chunk) {
      chunk.isUploaded = true;
      this.uploadState.uploadedSize += chunk.size;
      this.uploadState.lastUploadTime = Date.now();
    }
  }

  /**
   * 업로드 URL을 설정합니다
   */
  setUploadUrl(url: string): void {
    this.uploadState.uploadUrl = url;
  }

  /**
   * 현재 업로드 상태를 반환합니다
   */
  getUploadState(): UploadState {
    return { ...this.uploadState };
  }

  /**
   * 업로드 진행률을 계산합니다 (0-100)
   */
  getUploadProgress(): number {
    if (this.uploadState.totalSize === 0) return 0;
    return Math.round(
      (this.uploadState.uploadedSize / this.uploadState.totalSize) * 100,
    );
  }

  /**
   * 실패한 청크들을 재시도합니다
   */
  getFailedChunks(): ChunkInfo[] {
    const now = Date.now();
    const retryThreshold = this.retryDelay;

    return Array.from(this.chunks.values()).filter((chunk) => {
      return !chunk.isUploaded && now - chunk.timestamp > retryThreshold;
    });
  }

  /**
   * 재시도 가능한 청크들을 가져옵니다
   */
  getRetriableChunks(): ChunkInfo[] {
    const failedChunks = this.getFailedChunks();
    return failedChunks.filter((_, index) => {
      // maxRetries 횟수만큼만 재시도
      return index < this.maxRetries;
    });
  }

  /**
   * 청크를 제거합니다
   */
  removeChunk(chunkId: string): void {
    const chunk = this.chunks.get(chunkId);
    if (chunk) {
      this.chunks.delete(chunkId);
      this.uploadState.chunks = this.uploadState.chunks.filter(
        (c) => c.id !== chunkId,
      );
      if (!chunk.isUploaded) {
        this.uploadState.totalSize -= chunk.size;
      }
    }
  }

  /**
   * 모든 청크를 정리합니다
   */
  cleanup(): void {
    this.chunks.clear();
    this.uploadState.chunks = [];
    this.uploadState.totalSize = 0;
    this.uploadState.uploadedSize = 0;
  }

  /**
   * 세션 상태를 localStorage에서 복원합니다
   */
  static restoreFromStorage(sessionId: string): UploadState | null {
    try {
      const storageKey = `tusStreaming_${sessionId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error(
        '[TusStreamingManager] Error restoring from storage:',
        error,
      );
    }
    return null;
  }

  /**
   * 세션 상태를 localStorage에 저장합니다
   */
  saveToStorage(): void {
    try {
      const storageKey = `tusStreaming_${this.uploadState.sessionId}`;
      // Blob은 직렬화할 수 없으므로 기본 정보만 저장
      const stateToSave = {
        ...this.uploadState,
        chunks: this.uploadState.chunks.map((chunk) => ({
          ...chunk,
          blob: null, // Blob은 저장하지 않음
        })),
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('[TusStreamingManager] Error saving to storage:', error);
    }
  }

  /**
   * localStorage에서 세션 상태를 제거합니다
   */
  static removeFromStorage(sessionId: string): void {
    try {
      const storageKey = `tusStreaming_${sessionId}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error(
        '[TusStreamingManager] Error removing from storage:',
        error,
      );
    }
  }
}

/**
 * TUS 헤더 생성 유틸리티
 */
export const createTusHeaders = (
  token: string,
  duration: number,
  sessionId: string,
  offset?: number,
): Record<string, string> => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'X-Recording-Duration': duration.toString(),
    'X-Counsel-Session-Id': sessionId,
  };

  if (offset !== undefined) {
    headers['Upload-Offset'] = offset.toString();
  }

  return headers;
};

/**
 * Blob 크기를 MB 단위로 변환
 */
export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

/**
 * MB를 bytes로 변환
 */
export const mbToBytes = (mb: number): number => {
  return mb * 1024 * 1024;
};

/**
 * 청크 크기가 적절한지 확인
 */
export const isValidChunkSize = (
  blob: Blob,
  minSizeKB: number = 1,
  maxSizeMB: number = 10,
): boolean => {
  const minSize = minSizeKB * 1024;
  const maxSize = maxSizeMB * 1024 * 1024;
  return blob.size >= minSize && blob.size <= maxSize;
};

/**
 * TUS DetailedError 타입 정의
 */
interface TusDetailedError extends Error {
  originalResponse?: {
    getStatus(): number;
    getBody(): string;
  };
}

/**
 * 에러에서 재시도 가능한지 확인
 */
export const isRetryableError = (error: unknown): boolean => {
  if (!error) return false;

  const err = error as Error;

  // 네트워크 관련 에러는 재시도 가능
  if (err.name === 'NetworkError' || err.message?.includes('network')) {
    return true;
  }

  // TUS DetailedError 타입 체크
  const detailedError = error as TusDetailedError;
  if (detailedError.originalResponse) {
    const status = detailedError.originalResponse.getStatus();
    // 5xx 서버 에러나 408 Timeout, 429 Too Many Requests는 재시도 가능
    return status >= 500 || status === 408 || status === 429;
  }

  return false;
};
