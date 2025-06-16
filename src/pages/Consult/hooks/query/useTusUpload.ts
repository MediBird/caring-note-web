import { useCallback, useRef, useEffect } from 'react';
import * as tus from 'tus-js-client';
import { toast } from 'sonner';
import { useRecordingStore, RecordingStore } from '../store/useRecordingStore';
import { useTusDelete } from './useTusDelete';
import {
  useConvertSpeechToText,
  useAISummaryStatus,
} from './useAISummaryQuery';
import {
  getTusUploadConfig,
  extractFileIdFromUrl,
  checkExistingRecording as checkExistingRecordingUtil,
} from '../../utils/tusUtils';
import {
  RecordingError,
  RECORDING_CONFIG,
  AISummaryStatus,
} from '../../types/recording.types';

interface UseTusUploadOptions {
  counselSessionId: string;
}

interface UseTusUploadReturn {
  uploadRecording: () => Promise<string>;
  abortUpload: () => void;
  handleMerge: (counselSessionId: string) => Promise<void>;
  deleteFile: (counselSessionId: string) => Promise<void>;
  checkExistingRecording: () => Promise<void>;
  isUploading: boolean;
  error: string | null;
}

export const useTusUpload = ({
  counselSessionId,
}: UseTusUploadOptions): UseTusUploadReturn => {
  const uploadRef = useRef<tus.Upload | null>(null);

  // 스토어 액션들
  const { setFile, setUpload, setSession, startProcessing, completeRecording } =
    useRecordingStore();

  const deleteMutation = useTusDelete();
  const convertSpeechToTextMutation = useConvertSpeechToText();

  // AI 요약 상태 폴링
  const { data: aiSummaryStatus } = useAISummaryStatus(counselSessionId);

  // 이전 AI 요약 상태를 추적하기 위한 ref
  const prevAiSummaryStatusRef = useRef<string | null>(null);

  // 에러 생성 함수
  const createUploadError = useCallback(
    (message: string, details?: unknown): RecordingError => {
      const error = new Error(message) as RecordingError;
      error.code = 'UPLOAD_ERROR';
      error.details = details;
      return error;
    },
    [],
  );

  // AI 요약 상태 변화 감지
  useEffect(() => {
    if (aiSummaryStatus?.aiCounselSummaryStatus) {
      const currentStatus = aiSummaryStatus.aiCounselSummaryStatus.toString();
      const prevStatus = prevAiSummaryStatusRef.current;

      setSession({ aiSummaryStatus: currentStatus as AISummaryStatus });

      // 이전 상태가 있고, 상태가 변화했을 때만 toast 표시
      if (
        prevStatus &&
        prevStatus !== currentStatus &&
        currentStatus === 'GPT_COMPLETE'
      ) {
        completeRecording();
        toast.info('AI 요약이 완료되었습니다! 🎉');
      }

      // 현재 상태를 이전 상태로 저장
      prevAiSummaryStatusRef.current = currentStatus;
    }
  }, [aiSummaryStatus, setSession, completeRecording]);

  // 기존 녹음 파일 확인 함수
  const checkExistingRecording = useCallback(async () => {
    try {
      const result = await checkExistingRecordingUtil(counselSessionId);

      if (result.exists && result.duration && result.fileId) {
        setFile({
          fileId: result.fileId,
          duration: result.duration,
          isFromStorage: false,
        });
        setSession({ status: 'completed' });
        console.log(`기존 녹음 파일 발견: ${result.duration}초`);
      }
    } catch (error) {
      console.log('기존 녹음 파일 조회 실패', error);
    }
  }, [counselSessionId, setFile, setSession]);

  // 녹음 파일 업로드
  const uploadRecording = useCallback(async (): Promise<string> => {
    const state = useRecordingStore.getState();
    const blob = state.file.blob;

    if (!blob) {
      throw createUploadError('업로드할 녹음 파일이 없습니다.');
    }

    // 파일 크기 검증
    if (blob.size === 0) {
      throw createUploadError('녹음 파일이 비어있습니다.');
    }

    // 파일 형식 검증
    if (!blob.type.includes('audio')) {
      throw createUploadError('지원되지 않는 파일 형식입니다.');
    }

    setUpload({
      isUploading: true,
      progress: 0,
      error: null,
    });

    const file = new File([blob], 'recording.webm', {
      type: RECORDING_CONFIG.MIME_TYPE,
    });

    try {
      // TUS 업로드 설정 가져오기
      const uploadConfig = await getTusUploadConfig(counselSessionId);

      return new Promise((resolve, reject) => {
        // TUS 업로드 생성
        const upload = new tus.Upload(file, {
          ...uploadConfig,
          metadata: {
            ...uploadConfig.metadata,
            filename: 'recording.webm',
            filetype: RECORDING_CONFIG.MIME_TYPE,
            sessionId: counselSessionId,
            timestamp: Date.now().toString(),
          },
          onError: (uploadError) => {
            console.error('TUS 업로드 실패:', uploadError);
            const error = createUploadError(uploadError.message, uploadError);
            setUpload({
              isUploading: false,
              error: error.message,
            });
            reject(error);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
            const safePercentage = Math.min(percentage, 95); // 95%까지만 (병합 전)

            setUpload({ progress: safePercentage });
          },
          onSuccess: () => {
            console.log('TUS 업로드 완료:', upload.url);

            if (upload.url) {
              const extractedFileId = extractFileIdFromUrl(upload.url);
              setFile({ fileId: extractedFileId });
              setUpload({
                isUploading: false,
                progress: 95,
              });
              toast.info('녹음 업로드가 완료되었습니다!');
              resolve(extractedFileId);
            } else {
              const error = createUploadError(
                '업로드가 완료되었지만 파일 URL을 받지 못했습니다.',
              );
              setUpload({
                isUploading: false,
                error: error.message,
              });
              reject(error);
            }
          },
        });

        uploadRef.current = upload;

        // 이전 업로드 확인 및 시작
        upload
          .findPreviousUploads()
          .then((previousUploads) => {
            if (previousUploads.length) {
              upload.resumeFromPreviousUpload(previousUploads[0]);
              console.log('이전 업로드 재개:', previousUploads[0]);
            }
            upload.start();
          })
          .catch((findError) => {
            console.warn(
              '이전 업로드 조회 실패, 새로운 업로드를 시작합니다:',
              findError,
            );
            // 이전 업로드 조회에 실패해도 새로운 업로드는 시작
            upload.start();
          });
      });
    } catch (uploadError) {
      const error =
        uploadError instanceof Error
          ? createUploadError(uploadError.message, uploadError)
          : createUploadError('업로드 중 오류가 발생했습니다.');

      setUpload({
        isUploading: false,
        error: error.message,
      });
      throw error;
    }
  }, [counselSessionId, setUpload, setFile, createUploadError]);

  // 업로드 중단
  const abortUpload = useCallback(() => {
    if (uploadRef.current) {
      uploadRef.current.abort();
      uploadRef.current = null;
    }

    setUpload({
      isUploading: false,
      progress: 0,
      error: null,
    });
  }, [setUpload]);

  // AI 요약 프로세스 시작
  const handleMerge = useCallback(
    async (sessionId: string): Promise<void> => {
      try {
        startProcessing();
        await convertSpeechToTextMutation.mutateAsync(sessionId);

        // 업로드 완료 상태로 설정
        setUpload({ progress: 100 });

        // AI 요약 상태는 폴링으로 확인 (useEffect에서 처리)
        console.log('AI 요약 프로세스가 시작되었습니다.');
      } catch (mergeError) {
        const error =
          mergeError instanceof Error
            ? createUploadError(mergeError.message, mergeError)
            : createUploadError('AI 요약 처리 중 오류가 발생했습니다.');

        setUpload({ error: error.message });
        throw error;
      }
    },
    [
      startProcessing,
      convertSpeechToTextMutation,
      setUpload,
      createUploadError,
    ],
  );

  // 파일 삭제
  const deleteFile = useCallback(
    async (sessionId: string): Promise<void> => {
      try {
        await deleteMutation.mutateAsync(sessionId);

        // 상태 초기화
        setFile({
          blob: null,
          fileId: null,
          duration: 0,
          isFromStorage: false,
        });
        setUpload({
          progress: 0,
          isUploading: false,
          error: null,
        });

        console.log('파일이 삭제되었습니다.');
      } catch (deleteError) {
        const error =
          deleteError instanceof Error
            ? createUploadError(deleteError.message, deleteError)
            : createUploadError('파일 삭제 중 오류가 발생했습니다.');

        setUpload({ error: error.message });
        throw error;
      }
    },
    [deleteMutation, setFile, setUpload, createUploadError],
  );

  // 현재 업로드 상태 가져오기
  const currentUploadState = useRecordingStore(
    (state: RecordingStore) => state.upload,
  );

  return {
    uploadRecording,
    abortUpload,
    handleMerge,
    deleteFile,
    checkExistingRecording,
    isUploading:
      currentUploadState.isUploading ||
      deleteMutation.isPending ||
      convertSpeechToTextMutation.isPending,
    error: currentUploadState.error,
  };
};
