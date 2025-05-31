import * as tus from 'tus-js-client';
import { useRecordingStore } from '../store/useRecordingStore';
import { TusControllerApi } from '@/api/api/tus-controller-api';
import { Configuration } from '@/api/configuration';
import { BASE_PATH } from '@/api/base'; // BaseAPI가 VITE_BASE_API_URL 사용
import { AxiosError, AxiosInstance } from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import globalAxios from 'axios'; // BaseAPI의 기본 axios와 동일하게 설정
import { useRef, useEffect, useCallback } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Configuration basePath에 사용될 수 있음

// 스트리밍 업로드 설정
const STREAM_UPLOAD_CONFIG = {
  CHUNK_SIZE_MB: 2, // 2MB 청크 크기
  AUTO_UPLOAD_THRESHOLD_MB: 5, // 5MB마다 자동 업로드
  MAX_CHUNK_SIZE_MB: 10, // 최대 청크 크기
} as const;

export interface UseTusUploadProps {
  counselSessionId: string;
}

export function useTusUpload({ counselSessionId }: UseTusUploadProps) {
  const {
    setFileId,
    fileId: storedFileIdUrl, // 스토어에 저장된 fileId (TUS upload URL)
    completeRecording: storeCompleteRecordingMethod,
    setUploadProgress, // 진행률 표시를 위해 추가
    totalDuration,
    setTotalDuration,
  } = useRecordingStore();
  const { keycloak } = useKeycloak();
  const axiosInstance: AxiosInstance = globalAxios;

  const tusUploadRef = useRef<tus.Upload | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]); // 녹음된 데이터 청크들을 저장
  const isUploadCompletedRef = useRef<boolean>(false); // 업로드 완료 여부 추적
  const recordingStartTimeRef = useRef<number | null>(null); // 녹음 시작 시간
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalUploadedSizeRef = useRef<number>(0);
  const currentUploadOffsetRef = useRef<number>(0);

  // counselSessionId가 변경되면 이전 업로드 상태 정리
  useEffect(() => {
    isUploadCompletedRef.current = false;
    totalUploadedSizeRef.current = 0;
    currentUploadOffsetRef.current = 0;

    return () => {
      if (tusUploadRef.current) {
        console.log(
          '[TUS] Aborting previous upload due to counselSessionId change.',
        );
        tusUploadRef.current.abort(true);
        tusUploadRef.current = null;
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
      }
      mediaRecorderRef.current = null;
      recordedChunksRef.current = []; // 녹음된 청크들도 초기화
      isUploadCompletedRef.current = false;
      recordingStartTimeRef.current = null; // 녹음 시작 시간 초기화
      totalUploadedSizeRef.current = 0;
      currentUploadOffsetRef.current = 0;
    };
  }, [counselSessionId]);

  const getBaseApiConfig = useCallback((): Configuration => {
    return new Configuration({
      basePath: VITE_API_URL || BASE_PATH,
    });
  }, []);

  // 기존 업로드 상태를 확인하여 녹음 시간과 offset을 복원하는 함수
  const checkExistingUploadStatus = useCallback(
    async (fileUrl: string) => {
      if (!keycloak || !keycloak.token || !fileUrl) {
        return { duration: 0, offset: 0 };
      }

      try {
        const fileId = fileUrl.split('/').pop();
        if (!fileId) {
          console.warn('[TUS] Cannot extract fileId from URL:', fileUrl);
          return { duration: 0, offset: 0 };
        }

        const config = getBaseApiConfig();
        const tusApi = new TusControllerApi(
          config,
          config.basePath,
          axiosInstance,
        );

        console.log(`[TUS] Checking upload status for fileId: ${fileId}`);
        const response = await tusApi.getUploadStatus(fileId);

        // 응답 헤더에서 X-Recording-Duration과 Upload-Offset 값 가져오기
        const recordingDuration = response.headers?.['x-recording-duration'];
        const uploadOffset = response.headers?.['upload-offset'];

        let duration = 0;
        let offset = 0;

        if (recordingDuration && !isNaN(Number(recordingDuration))) {
          duration = Number(recordingDuration);
          console.log(
            `[TUS] Found existing recording duration: ${duration} seconds`,
          );
          setTotalDuration(duration);
        }

        if (uploadOffset && !isNaN(Number(uploadOffset))) {
          offset = Number(uploadOffset);
          currentUploadOffsetRef.current = offset;
          console.log(`[TUS] Found existing upload offset: ${offset} bytes`);
        }

        return { duration, offset };
      } catch (error) {
        console.error('[TUS] Error checking upload status:', error);
        return { duration: 0, offset: 0 };
      }
    },
    [keycloak, getBaseApiConfig, axiosInstance, setTotalDuration],
  );

  // 기존 업로드 파일이 있는 경우 상태 확인
  useEffect(() => {
    if (storedFileIdUrl && counselSessionId) {
      console.log(
        `[TUS] Checking existing upload status for: ${storedFileIdUrl}`,
      );
      checkExistingUploadStatus(storedFileIdUrl);
    }
  }, [storedFileIdUrl, counselSessionId, checkExistingUploadStatus]);

  // Blob 유효성 검사 함수
  const validateBlob = useCallback((blob: Blob): boolean => {
    // 최소 크기 검사 (1KB 이상)
    if (blob.size < 1024) {
      console.warn('[TUS] Blob too small:', blob.size, 'bytes');
      return false;
    }

    // 최대 크기 검사 (100MB 이하)
    if (blob.size > 100 * 1024 * 1024) {
      console.warn('[TUS] Blob too large:', blob.size, 'bytes');
      return false;
    }

    // MIME 타입 검사
    if (!blob.type.includes('audio') && !blob.type.includes('webm')) {
      console.warn('[TUS] Invalid blob type:', blob.type);
      return false;
    }

    return true;
  }, []);

  // 스트리밍 업로드를 위한 청크 업로드 함수
  const uploadChunks = useCallback(
    async (chunks: Blob[], isComplete: boolean = false) => {
      if (chunks.length === 0) return;

      const combinedBlob = new Blob(chunks, { type: 'audio/webm' });
      if (!validateBlob(combinedBlob)) {
        console.warn('[TUS] Invalid chunk blob, skipping upload');
        return;
      }

      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) console.log('[TUS] Token refreshed for chunk upload');
      } catch (error) {
        console.error('[TUS] Token refresh failed for chunk upload:', error);
        throw new Error('토큰 갱신 실패. 다시 시도해주세요.');
      }

      // 현재 총 녹음 시간 계산
      const currentTime = recordingStartTimeRef.current
        ? Math.floor((Date.now() - recordingStartTimeRef.current) / 1000)
        : 0;
      const currentTotalDuration = totalDuration + currentTime;

      console.log(
        `[TUS] Uploading chunk: ${combinedBlob.size} bytes, total duration: ${currentTotalDuration}s`,
      );

      const baseConfig = getBaseApiConfig();
      const tusMetadata = {
        filename: `session-${counselSessionId}-${Date.now()}.webm`,
        filetype: 'audio/webm',
        counselSessionId: counselSessionId,
      };

      const options: tus.UploadOptions = {
        endpoint: !storedFileIdUrl
          ? `${baseConfig.basePath}/v1/tus`
          : undefined,
        uploadUrl: storedFileIdUrl || undefined,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: tusMetadata,
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'X-Recording-Duration': currentTotalDuration.toString(),
          'X-Counsel-Session-Id': counselSessionId,
        },
        chunkSize: STREAM_UPLOAD_CONFIG.CHUNK_SIZE_MB * 1024 * 1024,
        onProgress: (bytesUploaded, bytesTotal) => {
          const totalProgress = totalUploadedSizeRef.current + bytesUploaded;
          if (bytesTotal > 0) {
            const percentage = Math.min(
              (totalProgress / (totalUploadedSizeRef.current + bytesTotal)) *
                100,
              100,
            );
            setUploadProgress(Math.round(percentage));
            console.log(
              `[TUS] Chunk Progress: ${bytesUploaded}/${bytesTotal} bytes (${percentage.toFixed(1)}%)`,
            );
          }
        },
        onError: (error: Error) => {
          const detailedError = error as tus.DetailedError;
          console.error(`[TUS] Chunk upload failed: ${detailedError.message}`);
          throw new Error(`청크 업로드 실패: ${detailedError.message}`);
        },
        onSuccess: async () => {
          if (tusUploadRef.current && tusUploadRef.current.url) {
            const uploadUrl = tusUploadRef.current.url;
            console.log('[TUS] Chunk upload succeeded:', uploadUrl);

            if (!storedFileIdUrl) {
              setFileId(uploadUrl);
            }

            totalUploadedSizeRef.current += combinedBlob.size;

            if (isComplete) {
              isUploadCompletedRef.current = true;
              console.log(
                '[TUS] All chunks uploaded successfully. Merge can be triggered now.',
              );
            }
          }
          tusUploadRef.current = null;
        },
      };

      tusUploadRef.current = new tus.Upload(combinedBlob, options);

      try {
        console.log('[TUS] Starting chunk upload...');
        if (storedFileIdUrl) {
          console.log(`[TUS] Resuming upload from: ${storedFileIdUrl}`);
        }
        tusUploadRef.current.start();
      } catch (error) {
        console.error('[TUS] Error starting chunk upload:', error);
        throw new Error('청크 업로드 시작 중 오류 발생');
      }
    },
    [
      keycloak,
      getBaseApiConfig,
      setFileId,
      setUploadProgress,
      validateBlob,
      storedFileIdUrl,
      counselSessionId,
      totalDuration,
    ],
  );

  // 주기적으로 청크를 업로드하는 함수
  const startStreamingUpload = useCallback(() => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }

    streamingIntervalRef.current = setInterval(() => {
      if (recordedChunksRef.current.length === 0) return;

      const totalSize = recordedChunksRef.current.reduce(
        (acc, chunk) => acc + chunk.size,
        0,
      );
      const thresholdSize =
        STREAM_UPLOAD_CONFIG.AUTO_UPLOAD_THRESHOLD_MB * 1024 * 1024;

      if (totalSize >= thresholdSize) {
        console.log(
          `[TUS] Auto-uploading chunks (${totalSize} bytes >= ${thresholdSize} bytes)`,
        );
        const chunksToUpload = [...recordedChunksRef.current];
        recordedChunksRef.current = [];

        uploadChunks(chunksToUpload, false).catch((error) => {
          console.error('[TUS] Auto-upload failed:', error);
          // 실패한 청크를 다시 큐에 넣기
          recordedChunksRef.current.unshift(...chunksToUpload);
        });
      }
    }, 2000); // 2초마다 확인
  }, [uploadChunks]);

  const stopStreamingUpload = useCallback(() => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
  }, []);

  const handleMerge = useCallback(
    async (sessionIdToMerge: string, uploadedFileUrl?: string) => {
      const fileUrlToLog =
        uploadedFileUrl || tusUploadRef.current?.url || storedFileIdUrl;
      console.log(
        `[TUS] handleMerge called for session: ${sessionIdToMerge}, Current TUS Upload URL: ${fileUrlToLog}`,
      );

      if (!fileUrlToLog) {
        const errorMsg =
          '[TUS] Merge cannot proceed: TUS upload URL is not set.';
        console.error(errorMsg);
        throw new Error('업로드된 파일 URL이 없습니다.');
      }

      if (!keycloak || !keycloak.token) {
        console.error('[TUS] Merge failed: No token');
        throw new Error('Merge 시도 중 인증 토큰이 없습니다.');
      }

      const config = getBaseApiConfig();
      const tusApiForMerge = new TusControllerApi(
        config,
        config.basePath,
        axiosInstance,
      );

      try {
        console.log(
          `[TUS] Calling tusApiForMerge.mergeMediaFile with counselSessionId: ${sessionIdToMerge}`,
        );
        console.log(`[TUS] Using file URL for merge: ${fileUrlToLog}`);

        const response = await tusApiForMerge.mergeMediaFile(sessionIdToMerge);
        console.log('[TUS] Merge API response:', response.data);
        storeCompleteRecordingMethod();
        setUploadProgress(100);
      } catch (error) {
        console.error('[TUS] Merge media file call failed:', error);
        if (error instanceof AxiosError) {
          console.error(
            '[TUS] Axios error details on merge:',
            error.response?.data,
            error.response?.status,
            error.config,
          );
        }
        throw error;
      }
    },
    [
      keycloak,
      axiosInstance,
      getBaseApiConfig,
      storeCompleteRecordingMethod,
      storedFileIdUrl,
      setUploadProgress,
    ],
  );

  const startStreamAndUpload = useCallback(
    async (
      recorder: MediaRecorder,
      // storedUploadUrl은 페이지 로드 후 이어하기 시 사용될 수 있음.
      // 지금은 새 녹음 시작 시에는 undefined.
      initialUploadUrl?: string,
    ) => {
      if (!keycloak || !keycloak.token) {
        console.error('[TUS] startStreamAndUpload: No token');
        throw new Error('인증되지 않았습니다. 로그인이 필요합니다.');
      }

      // 이미 업로드가 완료된 세션인지 확인
      if (isUploadCompletedRef.current && !initialUploadUrl) {
        console.warn('[TUS] Upload already completed for this session');
        throw new Error(
          '이 세션에서는 이미 녹음이 완료되었습니다. 새로운 녹음을 시작하려면 페이지를 새로고침해주세요.',
        );
      }

      if (tusUploadRef.current) {
        console.warn(
          '[TUS] Upload is already in progress. Aborting previous one.',
        );
        await tusUploadRef.current.abort(true);
        tusUploadRef.current = null;
      }

      mediaRecorderRef.current = recorder;
      setUploadProgress(0);
      // 녹음된 청크들 초기화 (새로운 녹음 시작 시에만)
      if (!initialUploadUrl) {
        recordedChunksRef.current = [];
        isUploadCompletedRef.current = false;
        totalUploadedSizeRef.current = 0;
        currentUploadOffsetRef.current = 0;
      }

      // 녹음 시작 시간 기록 (새 녹음이거나 이어하기인 경우)
      recordingStartTimeRef.current = Date.now();

      // MediaRecorder 이벤트 핸들러 설정
      if (!mediaRecorderRef.current) {
        console.error('[TUS] MediaRecorder is not available.');
        throw new Error('MediaRecorder를 사용할 수 없습니다.');
      }

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          console.log(`[TUS] Collecting chunk, size: ${event.data.size}`);
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log(
          '[TUS] MediaRecorder stopped, uploading remaining chunks...',
        );
        stopStreamingUpload();

        // 녹음 시작 시간 초기화
        if (recordingStartTimeRef.current) {
          recordingStartTimeRef.current = null;
        }

        if (isUploadCompletedRef.current) {
          console.log('[TUS] Upload already completed, skipping...');
          return;
        }

        // 남은 청크들을 최종 업로드
        if (recordedChunksRef.current.length > 0) {
          console.log(
            `[TUS] Uploading ${recordedChunksRef.current.length} remaining chunks`,
          );
          await uploadChunks([...recordedChunksRef.current], true);
          recordedChunksRef.current = [];
        }
      };

      mediaRecorderRef.current.onerror = (event: Event) => {
        const errorEvent = event as ErrorEvent;
        console.error('[TUS] MediaRecorder error:', errorEvent.error || event);
        stopStreamingUpload();
        throw new Error(
          `녹음 중 오류: ${errorEvent.error?.message || '알 수 없는 오류'}`,
        );
      };

      // 스트리밍 업로드 시작
      startStreamingUpload();
    },
    [
      keycloak,
      setUploadProgress,
      uploadChunks,
      startStreamingUpload,
      stopStreamingUpload,
    ],
  );

  const abortUpload = useCallback(() => {
    if (tusUploadRef.current) {
      console.log('[TUS] Aborting upload explicitly.');
      tusUploadRef.current
        .abort(true)
        .then(() => console.log('[TUS] Upload aborted by abortUpload() call.'))
        .catch((error) => console.error('[TUS] Error aborting upload:', error));
      tusUploadRef.current = null;
    }

    stopStreamingUpload();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }

    recordedChunksRef.current = [];
    isUploadCompletedRef.current = false;
    recordingStartTimeRef.current = null;
    totalUploadedSizeRef.current = 0;
    currentUploadOffsetRef.current = 0;
    setUploadProgress(0);
  }, [setUploadProgress, stopStreamingUpload]);

  // 페이지 로드 시 이어하기 위한 로직 (옵션)
  // 이 로직은 실제 MediaRecorder 인스턴스가 준비되고, 사용자가 이어하기를 원할 때 호출되어야 함.
  // 지금은 startStreamAndUpload 함수에 initialUploadUrl 파라미터를 추가하여,
  // ConsultRecordingControl에서 스토어의 fileId(URL)를 확인하고 필요시 전달하도록 함.

  return {
    startStreamAndUpload,
    abortUpload,
    handleMerge,
    checkExistingUploadStatus,
    uploadChunks,
    STREAM_UPLOAD_CONFIG,
  };
}
