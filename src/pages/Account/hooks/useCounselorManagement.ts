import { ResetPasswordReq, UpdateCounselorReq } from '@/api';
import { useCallback, useEffect, useState } from 'react';
import {
  useDeleteCounselor,
  useGetCounselorsByPage,
  useResetPassword,
  useUpdateCounselor,
} from './queries/useCounselorQuery';
import { useCounselorStore } from './store/useCounselorStore';

export const useCounselorManagement = () => {
  // 페이지 상태 관리
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // Zustand 스토어 사용
  const {
    counselors,
    pageInfo,
    selectedCounselorId,
    isLoading: storeLoading,
    error,
    setCounselors,
    setSelectedCounselorId,
    setLoading,
    setError,
    resetState,
  } = useCounselorStore();

  // React Query 사용
  const { data, isLoading, isError, refetch } = useGetCounselorsByPage({
    page,
    size,
  });

  // 뮤테이션 훅 사용
  const updateCounselorMutation = useUpdateCounselor();
  const deleteCounselorMutation = useDeleteCounselor();
  const resetPasswordMutation = useResetPassword();

  // 데이터가 변경될 때 스토어 업데이트
  useEffect(() => {
    if (data) {
      setCounselors({
        content: data.content,
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
      });
    }
  }, [data, setCounselors]);

  // 로딩 상태 동기화
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // 에러 상태 동기화
  useEffect(() => {
    if (isError) {
      setError('상담사 목록을 불러오는 중 오류가 발생했습니다.');
    } else {
      setError(null);
    }
  }, [isError, setError]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 상담사 업데이트 핸들러
  const handleUpdateCounselor = useCallback(
    async (counselorId: string, updateData: UpdateCounselorReq) => {
      try {
        await updateCounselorMutation.mutateAsync({
          counselorId,
          updateCounselorReq: updateData,
        });
        return true;
      } catch (error) {
        console.error('상담사 정보 업데이트 실패:', error);
        return false;
      }
    },
    [updateCounselorMutation],
  );

  // 상담사 삭제 핸들러
  const handleDeleteCounselor = useCallback(
    async (counselorId: string) => {
      if (window.confirm('정말로 이 상담사를 삭제하시겠습니까?')) {
        try {
          await deleteCounselorMutation.mutateAsync(counselorId);
          return true;
        } catch (error) {
          console.error('상담사 삭제 실패:', error);
          return false;
        }
      }
      return false;
    },
    [deleteCounselorMutation],
  );

  // 비밀번호 초기화 핸들러
  const handleResetPassword = useCallback(
    async (counselorId: string, resetData: ResetPasswordReq) => {
      try {
        await resetPasswordMutation.mutateAsync({
          counselorId,
          resetPasswordReq: resetData,
        });
        return true;
      } catch (error) {
        console.error('비밀번호 초기화 실패:', error);
        return false;
      }
    },
    [resetPasswordMutation],
  );

  // 선택된 상담사 변경 핸들러
  const handleSelectCounselor = useCallback(
    (counselorId: string | null) => {
      setSelectedCounselorId(counselorId);
    },
    [setSelectedCounselorId],
  );

  // 페이지 크기 변경 핸들러
  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0); // 페이지 크기가 변경되면 첫 페이지로 리셋
  }, []);

  // 목록 새로고침 핸들러
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // 상태
    counselors,
    pageInfo,
    selectedCounselorId,
    isLoading: storeLoading,
    error,
    page,
    size,

    // 핸들러
    handlePageChange,
    handleSizeChange,
    handleUpdateCounselor,
    handleDeleteCounselor,
    handleResetPassword,
    handleSelectCounselor,
    handleRefresh,

    // 기타
    resetState,
  };
};
