import { useCallback, useRef, useState, useEffect } from 'react';
import * as tus from 'tus-js-client';
import { toast } from 'sonner';
import { useRecordingStore } from '../store/useRecordingStore';
import { useTusDelete } from './useTusQuery';
import {
  useConvertSpeechToText,
  useAISummaryStatus,
} from './useAISummaryQuery';
import {
  getTusUploadConfig,
  extractFileIdFromUrl,
  checkExistingRecording as checkExistingRecordingUtil,
} from '../../utils/tusUtils';

interface UseTusUploadOptions {
  counselSessionId: string;
}

interface UseTusUploadReturn {
  isUploading: boolean;
  progress: number;
  fileId: string | null;
  error: string | null;
  startRecording: (stream: MediaStream) => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  uploadRecording: () => Promise<string>;
  abortUpload: () => void;
  handleMerge: (counselSessionId: string) => Promise<void>;
  deleteFile: (counselSessionId: string) => Promise<void>;
  checkExistingRecording: () => Promise<void>;
}

export const useTusUpload = ({
  counselSessionId,
}: UseTusUploadOptions): UseTusUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileId, setFileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadRef = useRef<tus.Upload | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const {
    setUploadProgress,
    startUploading,
    startProcessing,
    completeRecording,
    setTotalDuration,
    setRecordingStatus,
    setAiSummaryStatus,
    setRecordedBlob,
    recordedBlob,
  } = useRecordingStore();

  const deleteMutation = useTusDelete();
  const convertSpeechToTextMutation = useConvertSpeechToText();

  // AI 요약 상태 폴링
  const { data: aiSummaryStatus } = useAISummaryStatus(counselSessionId);

  // 이전 AI 요약 상태를 추적하기 위한 ref
  const prevAiSummaryStatusRef = useRef<string | null>(null);

  // AI 요약 상태 변화 감지
  useEffect(() => {
    if (aiSummaryStatus?.aiCounselSummaryStatus) {
      const currentStatus = aiSummaryStatus.aiCounselSummaryStatus.toString();
      const prevStatus = prevAiSummaryStatusRef.current;

      setAiSummaryStatus(aiSummaryStatus.aiCounselSummaryStatus);

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
  }, [aiSummaryStatus, setAiSummaryStatus, completeRecording]);

  // 기존 녹음 파일 확인 함수
  const checkExistingRecording = useCallback(async () => {
    try {
      const result = await checkExistingRecordingUtil(counselSessionId);

      if (result.exists && result.duration && result.fileId) {
        setTotalDuration(result.duration);
        setFileId(result.fileId);
        setRecordingStatus('completed');
        console.log(`기존 녹음 파일 발견: ${result.duration}초`);
      }
    } catch (error) {
      console.log('기존 녹음 파일 조회 실패', error);
    }
  }, [counselSessionId, setTotalDuration, setFileId, setRecordingStatus]);

  // 녹음 시작 (업로드 없이 녹음만)
  const startRecording = useCallback(
    async (stream: MediaStream): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          setError(null);
          chunksRef.current = [];

          // MediaRecorder 설정
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm',
          });
          mediaRecorderRef.current = mediaRecorder;

          // 녹음 데이터 수집
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunksRef.current.push(event.data);
            }
          };

          // 녹음 준비 완료
          mediaRecorder.onstart = () => {
            console.log('녹음 시작됨');
            resolve();
          };

          // 에러 처리
          mediaRecorder.onerror = (event) => {
            console.error('MediaRecorder 에러:', event);
            setError('녹음 중 오류가 발생했습니다.');
            reject(new Error('녹음 실패'));
          };

          // 실시간 청크 생성을 위해 주기적으로 데이터 요청
          mediaRecorder.start(1000); // 1초마다 데이터 생성
        } catch (recordingError) {
          const errorMessage =
            recordingError instanceof Error
              ? recordingError.message
              : '녹음 시작 중 오류가 발생했습니다.';
          setError(errorMessage);
          reject(recordingError);
        }
      });
    },
    [],
  );

  // 녹음 정지 (Blob 반환)
  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setRecordedBlob(blob);
          console.log('녹음 정지됨, Blob 크기:', blob.size);
          resolve(blob);
        };

        mediaRecorderRef.current.stop();
      } else {
        resolve(null);
      }
    });
  }, [setRecordedBlob]);

  // 녹음 파일 업로드 (저장 버튼 클릭 시 호출)
  const uploadRecording = useCallback(async (): Promise<string> => {
    const blobToUpload = recordedBlob;
    if (!blobToUpload) {
      throw new Error('업로드할 녹음 파일이 없습니다.');
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    // 업로드 상태로 변경
    startUploading();

    const file = new File([blobToUpload], 'recording.webm', {
      type: 'audio/webm',
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
            filetype: 'audio/webm',
          },
          onError: (uploadError) => {
            console.error('TUS 업로드 실패:', uploadError);
            setError(uploadError.message);
            setIsUploading(false);
            reject(uploadError);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
            setProgress(Math.min(percentage, 95)); // 95%까지만 (병합 전)
            setUploadProgress(Math.min(percentage, 95));
          },
          onSuccess: () => {
            console.log('TUS 업로드 완료:', upload.url);
            setProgress(95);
            setIsUploading(false);
            toast.success('녹음 업로드가 완료되었습니다!');

            if (upload.url) {
              const extractedFileId = extractFileIdFromUrl(upload.url);
              setFileId(extractedFileId);
              resolve(extractedFileId);
            } else {
              const errorMessage =
                '업로드가 완료되었지만 파일 URL을 받지 못했습니다.';
              setError(errorMessage);
              reject(new Error(errorMessage));
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
      const errorMessage =
        uploadError instanceof Error
          ? uploadError.message
          : '업로드 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsUploading(false);
      throw uploadError;
    }
  }, [recordedBlob, counselSessionId, setUploadProgress, startUploading]);

  const abortUpload = useCallback(() => {
    if (uploadRef.current) {
      uploadRef.current.abort();
      uploadRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setIsUploading(false);
    setProgress(0);
    setError(null);
    chunksRef.current = [];
  }, []);

  const handleMerge = useCallback(
    async (sessionId: string): Promise<void> => {
      try {
        // 1단계: AI 요약 프로세스 시작
        startProcessing();
        await convertSpeechToTextMutation.mutateAsync(sessionId);

        // AI 요약 상태는 폴링으로 확인 (useEffect에서 처리)
      } catch (mergeError) {
        const errorMessage =
          mergeError instanceof Error
            ? mergeError.message
            : '파일 병합 중 오류가 발생했습니다.';
        setError(errorMessage);
        throw mergeError;
      }
    },
    [startProcessing, convertSpeechToTextMutation],
  );

  const deleteFile = useCallback(
    async (sessionId: string): Promise<void> => {
      try {
        await deleteMutation.mutateAsync(sessionId);
        setFileId(null);
        setProgress(0);
        setError(null);
        setRecordedBlob(null);
      } catch (deleteError) {
        const errorMessage =
          deleteError instanceof Error
            ? deleteError.message
            : '파일 삭제 중 오류가 발생했습니다.';
        setError(errorMessage);
        throw deleteError;
      }
    },
    [deleteMutation, setRecordedBlob],
  );

  return {
    isUploading:
      isUploading ||
      deleteMutation.isPending ||
      convertSpeechToTextMutation.isPending,
    progress,
    fileId,
    error,
    startRecording,
    stopRecording,
    uploadRecording,
    abortUpload,
    handleMerge,
    deleteFile,
    checkExistingRecording,
  };
};
