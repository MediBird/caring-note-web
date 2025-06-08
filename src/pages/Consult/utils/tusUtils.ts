import { keycloak } from '@/app/keycloak';

// 인증 헤더 생성 함수
export const getAuthHeaders = async () => {
  // 토큰이 만료되었는지 확인하고 필요시 갱신
  if (keycloak.token && keycloak.isTokenExpired()) {
    try {
      await keycloak.updateToken(10);
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      keycloak.login();
      throw new Error('인증 토큰 갱신에 실패했습니다.');
    }
  }

  if (keycloak.token) {
    return {
      Authorization: `Bearer ${keycloak.token}`,
    };
  } else {
    throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
  }
};

// TUS 업로드 기본 설정
export const getTusUploadConfig = async (counselSessionId: string) => {
  const authHeaders = await getAuthHeaders();

  return {
    endpoint: `${import.meta.env.VITE_BASE_API_URL}/v1/tus`,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    headers: {
      ...authHeaders,
      'Upload-Defer-Length': '1',
    },
    metadata: {
      counselSessionId,
    },
  };
};

// 파일 ID 추출 함수
export const extractFileIdFromUrl = (url: string): string => {
  return url.split('/').pop() || '';
};

// 기존 녹음 파일 확인 함수
export const checkExistingRecording = async (counselSessionId: string) => {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(
      `${import.meta.env.VITE_BASE_API_URL}/v1/tus/${counselSessionId}`,
      {
        method: 'HEAD',
        headers: authHeaders,
      },
    );

    if (response.ok) {
      const recordingDuration = response.headers.get('X-Recording-Duration');
      if (recordingDuration) {
        const duration = parseInt(recordingDuration, 10);
        return {
          exists: true,
          duration,
          fileId: counselSessionId,
        };
      }
    }

    return { exists: false };
  } catch (error) {
    console.log('기존 녹음 파일 조회 실패', error);
    return { exists: false };
  }
};
