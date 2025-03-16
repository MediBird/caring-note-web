import {
  CounselCardControllerApi,
  UpdateBaseInformationReq,
  UpdateCounselCardStatusReqStatusEnum,
  UpdateHealthInformationReq,
  UpdateIndependentLifeInformationReq,
  UpdateLivingInformationReq,
} from '@/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  useCounselCardBaseInfoStore,
  useCounselCardHealthInfoStore,
  useCounselCardIndependentLifeInfoStore,
  useCounselCardLivingInfoStore,
} from './counselCardStore';

const counselCardApi = new CounselCardControllerApi();

// 기본 정보 쿼리 훅
export const useCounselCardBaseInfoQuery = (counselSessionId: string) => {
  const { setBaseInfo, setLoading, setError } = useCounselCardBaseInfoStore();

  return useQuery({
    queryKey: ['counselCardBaseInfo', counselSessionId],
    queryFn: async () => {
      setLoading(true);
      try {
        const response =
          await counselCardApi.selectCounselCardBaseInformation(
            counselSessionId,
          );
        setBaseInfo(response.data.data || {});
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '기본 정보 조회 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('기본 정보 조회 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!counselSessionId,
  });
};

// 건강 정보 쿼리 훅
export const useCounselCardHealthInfoQuery = (counselSessionId: string) => {
  const { setHealthInfo, setLoading, setError } =
    useCounselCardHealthInfoStore();

  return useQuery({
    queryKey: ['counselCardHealthInfo', counselSessionId],
    queryFn: async () => {
      setLoading(true);
      try {
        const response =
          await counselCardApi.selectCounselCardHealthInformation(
            counselSessionId,
          );
        setHealthInfo(response.data.data || {});
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '건강 정보 조회 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('건강 정보 조회 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!counselSessionId,
  });
};

// 독립생활 평가 쿼리 훅
export const useCounselCardIndependentLifeInfoQuery = (
  counselSessionId: string,
) => {
  const { setIndependentLifeInfo, setLoading, setError } =
    useCounselCardIndependentLifeInfoStore();

  return useQuery({
    queryKey: ['counselCardIndependentLifeInfo', counselSessionId],
    queryFn: async () => {
      setLoading(true);
      try {
        const response =
          await counselCardApi.selectCounselCardIndependentLifeInformation(
            counselSessionId,
          );
        setIndependentLifeInfo(response.data.data || {});
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '독립생활 평가 정보 조회 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError(
            '독립생활 평가 정보 조회 중 알 수 없는 오류가 발생했습니다.',
          );
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!counselSessionId,
  });
};

// 생활 정보 쿼리 훅
export const useCounselCardLivingInfoQuery = (counselSessionId: string) => {
  const { setLivingInfo, setLoading, setError } =
    useCounselCardLivingInfoStore();

  return useQuery({
    queryKey: ['counselCardLivingInfo', counselSessionId],
    queryFn: async () => {
      setLoading(true);
      try {
        const response =
          await counselCardApi.selectCounselCardLivingInformation(
            counselSessionId,
          );
        setLivingInfo(response.data.data || {});
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '생활 정보 조회 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('생활 정보 조회 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!counselSessionId,
  });
};

// 각 탭별 업데이트 뮤테이션 훅
export const useCounselCardBaseInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounselCardBaseInfoStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateBaseInformationReq;
    }) => {
      setLoading(true);
      try {
        const response = await counselCardApi.updateCounselCardBaseInformation(
          counselSessionId,
          data,
        );
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '기본 정보 업데이트 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('기본 정보 업데이트 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, { counselSessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ['counselCardBaseInfo', counselSessionId],
      });
    },
  });
};

export const useCounselCardHealthInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounselCardHealthInfoStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateHealthInformationReq;
    }) => {
      setLoading(true);
      try {
        const response =
          await counselCardApi.updateCounselCardHealthInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '건강 정보 업데이트 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('건강 정보 업데이트 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, { counselSessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ['counselCardHealthInfo', counselSessionId],
      });
    },
  });
};

export const useCounselCardIndependentLifeInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounselCardIndependentLifeInfoStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateIndependentLifeInformationReq;
    }) => {
      setLoading(true);
      try {
        const response =
          await counselCardApi.updateCounselCardIndependentLifeInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '독립생활 평가 정보 업데이트 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError(
            '독립생활 평가 정보 업데이트 중 알 수 없는 오류가 발생했습니다.',
          );
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, { counselSessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ['counselCardIndependentLifeInfo', counselSessionId],
      });
    },
  });
};

export const useCounselCardLivingInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounselCardLivingInfoStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateLivingInformationReq;
    }) => {
      setLoading(true);
      try {
        const response =
          await counselCardApi.updateCounselCardLivingInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '생활 정보 업데이트 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('생활 정보 업데이트 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, { counselSessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ['counselCardLivingInfo', counselSessionId],
      });
    },
  });
};

// 상담 카드 상태 업데이트 뮤테이션
export const useCounselCardStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      status,
    }: {
      counselSessionId: string;
      status: string;
    }) => {
      const response = await counselCardApi.updateCounselCardStatus(
        counselSessionId,
        { status: status as UpdateCounselCardStatusReqStatusEnum },
      );
      return response.data.data;
    },
    onSuccess: (_, { counselSessionId }) => {
      // 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['counselCardBaseInfo', counselSessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ['counselCardHealthInfo', counselSessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ['counselCardIndependentLifeInfo', counselSessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ['counselCardLivingInfo', counselSessionId],
      });
    },
  });
};
