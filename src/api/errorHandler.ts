import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ApiErrorResponse {
  message: string;
  data?: {
    errors: {
      field: string;
      message: string;
    }[];
  };
}

export const handleApiError = (
  error: AxiosError<ApiErrorResponse>,
  navigate?: any,
) => {
  const status = error.response?.status;
  const message =
    error.response?.data?.message || '알 수 없는 오류가 발생했습니다';
  const messageList = error.response?.data?.data?.errors || [];

  switch (status) {
    case 400:
      toast.error('잘못된 요청입니다', {
        description: messageList.length > 0 ? messageList[0].message : message,
      });
      break;
    case 401:
      toast.error('인증이 필요합니다', {
        description: '다시 로그인해주세요',
      });
      break;
    case 403:
      toast.error('권한이 없습니다', {
        description: message,
      });
      if (navigate) {
        navigate('/forbidden');
      } else {
        window.location.href = '/forbidden';
      }
      break;
    case 404:
      toast.error('요청한 리소스를 찾을 수 없습니다', {
        description: message,
      });
      break;
    case 500:
      toast.error('서버 오류가 발생했습니다', {
        description: message,
      });
      break;
    default:
      toast.error('오류가 발생했습니다', {
        description: message,
      });
  }
};
