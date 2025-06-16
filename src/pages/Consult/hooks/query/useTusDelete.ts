import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAuthHeaders } from '../../utils/tusUtils';

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
    onSuccess: (_: unknown, counselSessionId: string) => {
      queryClient.invalidateQueries({
        queryKey: ['recording', counselSessionId],
      });
      toast.info('녹음 파일이 삭제되었습니다.');
    },
    onError: (error: unknown) => {
      console.error('삭제 실패:', error);
      toast.error('파일 삭제에 실패했습니다.');
    },
  });
};
