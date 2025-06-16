import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import * as tus from 'tus-js-client';
import { useRecordingStore } from '../store/useRecordingStore';
import { toast } from 'sonner';
import {
  getTusUploadConfig,
  extractFileIdFromUrl,
  getAuthHeaders,
} from '../../utils/tusUtils';

interface UseTusUploadOptions {
  counselSessionId: string;
}

interface UseTusUploadReturn {
  startUpload: (file: File) => Promise<void>;
  pauseUpload: () => void;
  resumeUpload: () => void;
  abortUpload: () => void;
  isUploading: boolean;
}

export const useTusUpload = ({
  counselSessionId,
}: UseTusUploadOptions): UseTusUploadReturn => {
  const queryClient = useQueryClient();
  const uploadRef = useRef<tus.Upload | null>(null);

  const { setUploadProgress, setFileId, setError, completeRecording } =
    useRecordingStore();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        // TUS 업로드 설정 가져오기
        const uploadConfig = await getTusUploadConfig(counselSessionId);

        return new Promise<void>((resolve, reject) => {
          const upload = new tus.Upload(file, {
            ...uploadConfig,
            metadata: {
              ...uploadConfig.metadata,
              filename: file.name,
              filetype: file.type,
            },
            onError: (error) => {
              console.error('TUS 업로드 실패:', error);
              setError(error.message);
              reject(error);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
              const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
              setUploadProgress(Math.min(percentage, 95)); // 95%까지만 (병합 전)
            },
            onSuccess: () => {
              console.log('TUS 업로드 완료:', upload.url);
              if (upload.url) {
                const fileId = extractFileIdFromUrl(upload.url);
                setFileId(fileId);
              }
              setUploadProgress(100);
              completeRecording();
              resolve();
            },
          });

          uploadRef.current = upload;
        });
      } catch (authError) {
        console.error('인증 실패:', authError);
        setError('인증에 실패했습니다. 다시 로그인해주세요.');
        throw authError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['recording', counselSessionId],
      });
      toast.info('녹음 파일이 성공적으로 업로드되었습니다!');
    },
    onError: (error) => {
      console.error('업로드 실패:', error);
      toast.error('파일 업로드에 실패했습니다.');
    },
  });

  const startUpload = useCallback(
    async (file: File) => {
      await uploadMutation.mutateAsync(file);
    },
    [uploadMutation],
  );

  const pauseUpload = useCallback(() => {
    if (uploadRef.current) {
      uploadRef.current.abort();
    }
  }, []);

  const resumeUpload = useCallback(() => {
    if (uploadRef.current) {
      uploadRef.current.start();
    }
  }, []);

  const abortUpload = useCallback(() => {
    if (uploadRef.current) {
      uploadRef.current.abort();
      uploadRef.current = null;
    }
    setUploadProgress(0);
    setError(null);
  }, [setUploadProgress, setError]);

  return {
    startUpload,
    pauseUpload,
    resumeUpload,
    abortUpload,
    isUploading: uploadMutation.isPending,
  };
};

export const useTusDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (counselSessionId: string) => {
      // 인증 헤더 가져오기
      const authHeaders = await getAuthHeaders();

      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/v1/tus/${counselSessionId}`,
        {
          method: 'DELETE',
          headers: authHeaders,
        },
      );

      if (!response.ok) {
        throw new Error('파일 삭제에 실패했습니다.');
      }

      return response;
    },
    onSuccess: (_, counselSessionId) => {
      queryClient.invalidateQueries({
        queryKey: ['recording', counselSessionId],
      });
      toast.info('녹음 파일이 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('삭제 실패:', error);
      toast.error('파일 삭제에 실패했습니다.');
    },
  });
};
