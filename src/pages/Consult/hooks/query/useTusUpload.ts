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

export interface UseTusUploadProps {
  counselSessionId: string;
}

export function useTusUpload({ counselSessionId }: UseTusUploadProps) {
  const {
    setFileId,
    fileId: storedFileIdUrl, // 스토어에 저장된 fileId (TUS upload URL)
    completeRecording: storeCompleteRecordingMethod,
    setUploadProgress, // 진행률 표시를 위해 추가
    recordedDuration, // 현재 녹음된 시간
    setRecordedDuration, // 녹음 시간 설정
  } = useRecordingStore();
  const { keycloak } = useKeycloak();
  const axiosInstance: AxiosInstance = globalAxios;

  const tusUploadRef = useRef<tus.Upload | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]); // 녹음된 데이터 청크들을 저장
  const isUploadCompletedRef = useRef<boolean>(false); // 업로드 완료 여부 추적
  const recordingStartTimeRef = useRef<number | null>(null); // 녹음 시작 시간

  // counselSessionId가 변경되면 이전 업로드 상태 정리
  useEffect(() => {
    // 새로운 세션 시작 시 업로드 완료 상태 초기화
    isUploadCompletedRef.current = false;

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
      mediaRecorderRef.current = null;
      recordedChunksRef.current = []; // 녹음된 청크들도 초기화
      isUploadCompletedRef.current = false;
      recordingStartTimeRef.current = null; // 녹음 시작 시간 초기화
    };
  }, [counselSessionId]);

  const getBaseApiConfig = useCallback((): Configuration => {
    return new Configuration({
      basePath: VITE_API_URL || BASE_PATH,
    });
  }, []);

  // 기존 업로드 상태를 확인하여 녹음 시간을 복원하는 함수
  const checkExistingUploadStatus = useCallback(
    async (fileUrl: string) => {
      if (!keycloak || !keycloak.token || !fileUrl) {
        return;
      }

      try {
        // fileUrl에서 fileId 추출 (URL의 마지막 부분)
        const fileId = fileUrl.split('/').pop();
        if (!fileId) {
          console.warn('[TUS] Cannot extract fileId from URL:', fileUrl);
          return;
        }

        const config = getBaseApiConfig();
        const tusApi = new TusControllerApi(
          config,
          config.basePath,
          axiosInstance,
        );

        console.log(`[TUS] Checking upload status for fileId: ${fileId}`);
        const response = await tusApi.getUploadStatus(fileId);

        // 응답 헤더에서 X-Recording-Duration 값 가져오기
        const recordingDuration = response.headers?.['x-recording-duration'];
        if (recordingDuration && !isNaN(Number(recordingDuration))) {
          const duration = Number(recordingDuration);
          console.log(
            `[TUS] Found existing recording duration: ${duration} seconds`,
          );
          setRecordedDuration(duration);
        }
      } catch (error) {
        console.error('[TUS] Error checking upload status:', error);
        // 에러가 발생해도 녹음 진행에는 영향을 주지 않도록 조용히 처리
      }
    },
    [keycloak, getBaseApiConfig, axiosInstance, setRecordedDuration],
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

        // 서버 API가 counselSessionId 외에 TUS file ID (URL의 마지막 부분)를 필요로 하는지 확인 필요
        // 현재는 counselSessionId만 전달하고 있음. 서버가 이 ID로 TUS 파일들을 찾아야 함.
        const response = await tusApiForMerge.mergeMediaFile(sessionIdToMerge);
        console.log('[TUS] Merge API response:', response.data);
        storeCompleteRecordingMethod();
        setUploadProgress(100); // 병합 성공 시 100%
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
        // 에러를 다시 throw하여 상위 컴포넌트에서 처리할 수 있도록 함
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
      currentCounselSessionId: string,
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
        console.log('[TUS] MediaRecorder stopped, starting upload...');

        // 녹음 중지 시 누적 시간 업데이트
        if (recordingStartTimeRef.current) {
          const currentRecordingDuration = Math.floor(
            (Date.now() - recordingStartTimeRef.current) / 1000,
          );
          const newTotalDuration = recordedDuration + currentRecordingDuration;
          setRecordedDuration(newTotalDuration);
          console.log(
            `[TUS] Updated total recording duration: ${newTotalDuration} seconds`,
          );
          recordingStartTimeRef.current = null; // 시작 시간 초기화
        }

        // 이미 업로드가 완료된 경우 중복 업로드 방지
        if (isUploadCompletedRef.current) {
          console.log('[TUS] Upload already completed, skipping...');
          return;
        }

        if (recordedChunksRef.current.length > 0) {
          // 모든 청크를 하나의 Blob으로 합치기
          const finalBlob = new Blob(recordedChunksRef.current, {
            type: 'audio/webm',
          });
          console.log(`[TUS] Final blob size: ${finalBlob.size} bytes`);

          // Blob 유효성 검사
          if (!validateBlob(finalBlob)) {
            throw new Error(
              '녹음된 파일이 유효하지 않습니다. 다시 녹음해주세요.',
            );
          }

          // TUS 업로드 시작
          await startTusUpload(
            finalBlob,
            currentCounselSessionId,
            initialUploadUrl,
          );
        } else {
          console.warn('[TUS] No recorded chunks to upload');
          throw new Error('녹음된 데이터가 없습니다.');
        }
      };

      mediaRecorderRef.current.onerror = (event: Event) => {
        const errorEvent = event as ErrorEvent;
        console.error('[TUS] MediaRecorder error:', errorEvent.error || event);
        throw new Error(
          `녹음 중 오류: ${errorEvent.error?.message || '알 수 없는 오류'}`,
        );
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keycloak, getBaseApiConfig, setUploadProgress, validateBlob],
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
    // MediaRecorder 중지
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
    // 녹음된 청크들 초기화
    recordedChunksRef.current = [];
    isUploadCompletedRef.current = false;
    recordingStartTimeRef.current = null; // 녹음 시작 시간 초기화
    setUploadProgress(0); // 중단 시 진행률 초기화
  }, [setUploadProgress]);

  // TUS 업로드를 시작하는 헬퍼 함수
  const startTusUpload = useCallback(
    async (blob: Blob, counselSessionId: string, initialUploadUrl?: string) => {
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) console.log('[TUS] Token refreshed for upload');
      } catch (error) {
        console.error('[TUS] Token refresh failed for upload:', error);
        throw new Error('토큰 갱신 실패. 다시 시도해주세요.');
      }

      // 현재까지의 녹음 시간 계산 (기존 duration + 이번 녹음 시간)
      const currentRecordingDuration = recordingStartTimeRef.current
        ? Math.floor((Date.now() - recordingStartTimeRef.current) / 1000)
        : 0;
      const totalDuration = recordedDuration + currentRecordingDuration;

      console.log(
        `[TUS] Total recording duration: ${totalDuration} seconds (previous: ${recordedDuration}s, current: ${currentRecordingDuration}s)`,
      );

      const baseConfig = getBaseApiConfig();
      const tusMetadata = {
        filename: `session-${counselSessionId}-${Date.now()}.webm`,
        filetype: 'audio/webm',
        counselSessionId: counselSessionId,
      };

      const options: tus.UploadOptions = {
        endpoint: !initialUploadUrl
          ? `${baseConfig.basePath}/v1/tus`
          : undefined,
        uploadUrl: initialUploadUrl,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: tusMetadata,
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'X-Recording-Duration': totalDuration.toString(), // 총 녹음 시간 추가
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          if (bytesTotal > 0) {
            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
            console.log(
              `[TUS] Upload Progress: ${bytesUploaded} bytes / ${bytesTotal} bytes (${percentage}%)`,
            );
            setUploadProgress(parseFloat(percentage));
          } else {
            console.log(
              `[TUS] Upload Progress: ${bytesUploaded} bytes uploaded`,
            );
          }
        },
        onError: (error: Error) => {
          const detailedError = error as tus.DetailedError;
          console.log(`[TUS] Failed because: ${detailedError.message}`);

          let message = `[TUS] Upload Failed: ${detailedError.message}`;
          if (detailedError.originalResponse) {
            message += ` (Server status: ${detailedError.originalResponse.getStatus()}, Response: ${detailedError.originalResponse.getBody()})`;
          }
          console.error(
            message,
            detailedError.originalRequest,
            detailedError.originalResponse,
          );
          throw new Error(`TUS 업로드 실패: ${detailedError.message}`);
        },
        onSuccess: async () => {
          if (tusUploadRef.current && tusUploadRef.current.url) {
            const uploadUrl = tusUploadRef.current.url;
            const filename = options.metadata?.filename || 'unknown_file';
            console.log(`[TUS] Download ${filename} from ${uploadUrl}`);

            console.log('[TUS] Upload Succeeded.');
            setFileId(uploadUrl);
            isUploadCompletedRef.current = true; // 업로드 완료 표시
            console.log('[TUS] Upload successful. Merge can be triggered now.');
          } else {
            console.error('[TUS] Upload succeeded but no URL found.');
            throw new Error('업로드 성공했으나 파일 URL을 찾을 수 없습니다.');
          }
          tusUploadRef.current = null;
        },
      };

      tusUploadRef.current = new tus.Upload(blob, options);
      try {
        console.log('[TUS] Starting TUS upload...');
        if (initialUploadUrl) {
          console.log(
            `[TUS] Attempting to resume upload from: ${initialUploadUrl}`,
          );
        }
        tusUploadRef.current.start();
      } catch (error) {
        console.error('[TUS] Error calling tusUpload.start():', error);
        throw new Error('TUS 업로드 시작 중 오류 발생');
      }
    },
    [keycloak, getBaseApiConfig, setFileId, setUploadProgress],
  );

  // 페이지 로드 시 이어하기 위한 로직 (옵션)
  // 이 로직은 실제 MediaRecorder 인스턴스가 준비되고, 사용자가 이어하기를 원할 때 호출되어야 함.
  // 지금은 startStreamAndUpload 함수에 initialUploadUrl 파라미터를 추가하여,
  // ConsultRecordingControl에서 스토어의 fileId(URL)를 확인하고 필요시 전달하도록 함.

  return {
    startStreamAndUpload,
    abortUpload,
    handleMerge,
    checkExistingUploadStatus,
  };
}
