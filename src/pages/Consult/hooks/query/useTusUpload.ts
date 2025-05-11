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
    setError: setRecordingError,
    fileId: storedFileIdUrl, // 스토어에 저장된 fileId (TUS upload URL)
    completeRecording: storeCompleteRecordingMethod,
    setUploadProgress, // 진행률 표시를 위해 추가
  } = useRecordingStore();
  const { keycloak } = useKeycloak();
  const axiosInstance: AxiosInstance = globalAxios;

  const tusUploadRef = useRef<tus.Upload | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamControllerRef =
    useRef<ReadableStreamDefaultController<Blob> | null>(null);

  // counselSessionId가 변경되면 이전 업로드 상태 정리
  useEffect(() => {
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
      if (streamControllerRef.current) {
        try {
          streamControllerRef.current.close();
        } catch (e) {
          // 이미 닫혔을 수 있음
        }
        streamControllerRef.current = null;
      }
    };
  }, [counselSessionId]);

  const getBaseApiConfig = useCallback((): Configuration => {
    return new Configuration({
      basePath: VITE_API_URL || BASE_PATH,
    });
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
        setRecordingError(
          '업로드된 파일 URL이 없어 병합을 진행할 수 없습니다.',
        );
        return;
      }

      if (!keycloak || !keycloak.token) {
        setRecordingError('Merge 시도 중 인증 토큰이 없습니다.');
        console.error('[TUS] Merge failed: No token');
        return;
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
        // 서버 API가 counselSessionId 외에 TUS file ID (URL의 마지막 부분)를 필요로 하는지 확인 필요
        // 현재는 counselSessionId만 전달하고 있음. 서버가 이 ID로 TUS 파일들을 찾아야 함.
        const response = await tusApiForMerge.mergeMediaFile(sessionIdToMerge);
        console.log('[TUS] Merge API response:', response.data);
        setRecordingError(null);
        storeCompleteRecordingMethod();
        setUploadProgress(100); // 병합 성공 시 100%
      } catch (error) {
        console.error('[TUS] Merge media file call failed:', error);
        const message =
          error instanceof AxiosError && error.response?.data?.message
            ? `파일 병합 API 오류: ${error.response.data.message}`
            : error instanceof Error
              ? `파일 병합 실패: ${error.message}`
              : '파일 병합 중 알 수 없는 오류 발생';
        setRecordingError(message);
        if (error instanceof AxiosError) {
          console.error(
            '[TUS] Axios error details on merge:',
            error.response?.data,
            error.response?.status,
            error.config,
          );
        }
      }
    },
    [
      keycloak,
      axiosInstance,
      getBaseApiConfig,
      setRecordingError,
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
        setRecordingError('인증되지 않았습니다. 로그인이 필요합니다.');
        console.error('[TUS] startStreamAndUpload: No token');
        return;
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

      const stream = new ReadableStream<Blob>({
        start(controller) {
          streamControllerRef.current = controller;
          if (!mediaRecorderRef.current) {
            console.error(
              '[TUS] MediaRecorder is not available at stream start.',
            );
            controller.error(new Error('MediaRecorder not available'));
            return;
          }
          mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
            if (
              event.data &&
              event.data.size > 0 &&
              streamControllerRef.current
            ) {
              console.log(`[TUS] Enqueuing chunk, size: ${event.data.size}`);
              streamControllerRef.current.enqueue(event.data);
            }
          };
          mediaRecorderRef.current.onstop = () => {
            if (streamControllerRef.current) {
              console.log('[TUS] MediaRecorder stopped, closing stream.');
              streamControllerRef.current.close();
              streamControllerRef.current = null; // prevent further use
            }
          };
          mediaRecorderRef.current.onerror = (event: Event) => {
            const errorEvent = event as ErrorEvent;
            console.error(
              '[TUS] MediaRecorder error:',
              errorEvent.error || event,
            );
            if (streamControllerRef.current) {
              streamControllerRef.current.error(
                errorEvent.error || new Error('MediaRecorder error'),
              );
            }
            setRecordingError(
              `녹음 중 오류: ${errorEvent.error?.message || '알 수 없는 오류'}`,
            );
          };
        },
        cancel(reason) {
          console.log('[TUS] ReadableStream cancelled:', reason);
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === 'recording'
          ) {
            mediaRecorderRef.current.stop();
          }
        },
      });

      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) console.log('[TUS] Token refreshed for stream upload');
      } catch (error) {
        console.error('[TUS] Token refresh failed for stream upload:', error);
        setRecordingError('토큰 갱신 실패. 다시 시도해주세요.');
        return;
      }

      const baseConfig = getBaseApiConfig();
      const tusMetadata = {
        filename: `session-${currentCounselSessionId}.webm`,
        filetype: 'audio/webm', // MediaRecorder에서 설정한 타입과 일치해야 함
        counselSessionId: currentCounselSessionId,
      };

      const options: tus.UploadOptions = {
        endpoint: !initialUploadUrl
          ? `${baseConfig.basePath}/v1/tus`
          : undefined,
        uploadUrl: initialUploadUrl,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: tusMetadata,
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
        uploadLengthDeferred: true, // 스트리밍이므로 길이를 미리 알 수 없음
        onProgress: (bytesUploaded, bytesTotal) => {
          // bytesTotal은 uploadLengthDeferred: true 일때는 정확하지 않을 수 있음.
          // TUS 서버가 Upload-Length를 응답하거나, 전체 길이를 추정해야 함.
          // 여기서는 임시로 bytesUploaded 값만 로깅하거나, 서버가 Offset을 주면 그걸 기준으로 계산
          console.log(
            `[TUS] Stream Progress: Uploaded ${bytesUploaded} bytes.`,
          );
          // 실제 전체 파일 크기를 알 수 없으므로, setUploadProgress는 다른 방식으로 계산해야 할 수 있음
          // 또는 청크 수 기반으로 단순 계산하거나, 마지막 merge 성공 시 100%로 설정.
          // 현재는 단순 바이트 수로만 로깅. setUploadProgress는 onChunkComplete 또는 onSuccess에서 더 의미있게 사용.
          // 여기서는 setUploadProgress를 사용하지 않거나, 매우 대략적인 값만 제공.
          // 예를 들어, 평균 파일 크기를 예상해서 계산할 수 있지만 정확하지 않음.
          // 지금은 bytesUploaded를 그대로 store에 넘겨서 UI에서 활용하도록 할 수도 있음
          if (bytesTotal > 0) {
            // bytesTotal이 알려진 경우 (이어하기 등)
            setUploadProgress((bytesUploaded / bytesTotal) * 100);
          } else {
            // bytesTotal을 모를 때, 진행률을 어떻게 표시할지?
            // 여기서는 임시로, 특정 숫자(예: 5MB)까지는 비례해서 올리고 그 이후는 조금씩 올리는 방식 등
            // 여기서는 setUploadProgress는 onSuccess에서 100%로 설정하는 것 외에는 일단 보류.
          }
        },
        onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
          console.log(
            `[TUS] Chunk complete: chunkSize ${chunkSize}, bytesAccepted ${bytesAccepted}, bytesTotal ${bytesTotal}`,
          );
          // 이 시점에서 bytesAccepted (서버가 받은 총 바이트, 즉 Upload-Offset)를 기준으로 진행률 업데이트 가능
          if (bytesTotal > 0) {
            // bytesTotal이 서버로부터 알려진 경우
            setUploadProgress((bytesAccepted / bytesTotal) * 100);
          } else {
            // bytesTotal을 모를 때, 정확한 진행률 계산이 어려움.
            // 업로드된 bytesAccepted 값만 표시하거나, 매우 대략적인 추정치 사용 가능.
            // 여기서는 bytesTotal을 모르면 진행률 업데이트를 보수적으로 처리.
            console.log(
              `[TUS] bytesTotal is unknown, cannot calculate precise progress. Accepted: ${bytesAccepted}`,
            );
          }
        },
        onError: (error: Error) => {
          const detailedError = error as tus.DetailedError;
          let message = `[TUS] Stream Upload Failed: ${detailedError.message}`;
          if (detailedError.originalResponse) {
            message += ` (Server status: ${detailedError.originalResponse.getStatus()}, Response: ${detailedError.originalResponse.getBody()})`;
          }
          console.error(
            message,
            detailedError.originalRequest,
            detailedError.originalResponse,
          );
          setRecordingError(`TUS 스트림 업로드 실패: ${detailedError.message}`);
          if (streamControllerRef.current) {
            // 스트림이 아직 열려있다면 에러 전파
            try {
              streamControllerRef.current.error(detailedError);
            } catch (e) {
              /* 이미 닫힘 */
            }
          }
          tusUploadRef.current = null; // 실패 시 참조 초기화
        },
        onSuccess: async () => {
          console.log(
            '[TUS] Stream Upload Succeeded. Full file presumed uploaded.',
          );
          if (tusUploadRef.current && tusUploadRef.current.url) {
            const newFileUrl = tusUploadRef.current.url;
            console.log(`[TUS] New TUS Upload URL: ${newFileUrl}`);
            setFileId(newFileUrl); // 스토어에 TUS URL 저장

            // 업로드 성공 후 바로 병합 시도하던 로직 제거
            // await handleMerge(currentCounselSessionId, newFileUrl);
            console.log(
              '[TUS] Upload successful. Merge must be triggered manually now.',
            );
            // 진행률 100%는 병합 성공 시점으로 이동하거나, 여기서 청크 업로드 완료 의미로 99% 등 표시 가능
            // setUploadProgress(100); // 이 시점은 청크 업로드 완료, 병합 전.
          } else {
            console.error(
              '[TUS] Upload succeeded but no URL found on tus.Upload instance.',
            );
            setRecordingError('업로드 성공했으나 파일 URL을 찾을 수 없습니다.');
          }
          tusUploadRef.current = null; // 성공 후 참조 초기화
        },
      };

      // @ts-expect-error // TODO: tus-js-client의 ReadableStream 타입 호환성 확인 필요
      tusUploadRef.current = new tus.Upload(stream, options);
      try {
        console.log('[TUS] Starting TUS stream upload...');
        if (initialUploadUrl) {
          // 이어하기 시도
          console.log(
            `[TUS] Attempting to resume upload from: ${initialUploadUrl}`,
          );
        }
        tusUploadRef.current.start();
        // 새 업로드 시작 시 스토어의 fileId (URL)도 여기서 설정하는 것이 좋을 수 있음
        // 단, TUS 서버가 URL을 언제 확정해주는지에 따라 다름.
        // 보통 첫 PATCH/HEAD 이후에 upload.url이 확정됨.
        // 지금은 onSuccess에서만 setFileId 호출.
      } catch (error) {
        console.error('[TUS] Error calling tusUpload.start():', error);
        setRecordingError('TUS 업로드 시작 중 오류 발생');
        if (streamControllerRef.current) {
          try {
            streamControllerRef.current.error(error as Error);
          } catch (e) {
            /* 이미 닫힘 */
          }
        }
        tusUploadRef.current = null;
      }
    },
    [
      keycloak,
      getBaseApiConfig,
      setRecordingError,
      handleMerge,
      setFileId,
      setUploadProgress,
    ],
  );

  const abortUpload = useCallback(() => {
    if (tusUploadRef.current) {
      console.log('[TUS] Aborting upload explicitly.');
      tusUploadRef.current
        .abort(true)
        .then(() => console.log('[TUS] Upload aborted by abortUpload() call.'))
        .catch((e) => console.error('[TUS] Error aborting upload:', e));
      tusUploadRef.current = null;
    }
    // 스트림도 닫아줘야 함
    if (streamControllerRef.current) {
      try {
        streamControllerRef.current.close();
      } catch (e) {
        /* 이미 닫힘 */
      }
      streamControllerRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
    setUploadProgress(0); // 중단 시 진행률 초기화
  }, []);

  // 페이지 로드 시 이어하기 위한 로직 (옵션)
  // 이 로직은 실제 MediaRecorder 인스턴스가 준비되고, 사용자가 이어하기를 원할 때 호출되어야 함.
  // 지금은 startStreamAndUpload 함수에 initialUploadUrl 파라미터를 추가하여,
  // ConsultRecordingControl에서 스토어의 fileId(URL)를 확인하고 필요시 전달하도록 함.

  return { startStreamAndUpload, abortUpload, handleMerge };
}
