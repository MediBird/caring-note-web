import { useState, useCallback } from 'react';
import { SelectCounseleeRes } from '@/api/api';
import { useCounseleeStore } from '../store/counseleeInfoStore';
import {
  useSelectCounseleeList,
  useDeleteCounseleeInfo,
  useCreateCounseleeInfo,
  useUpdateCounseleeInfo,
} from './useCounseleeInfoQuery';
import { AddCounseleeFormData } from '../../components/dialog/CounseleeDialog';

export const useCounseleeManagement = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  const {
    filter,
    filterOptions,
    setFilter,
    fetchBirthDates,
    fetchInstitutions,
  } = useCounseleeStore();

  const { data, refetch } = useSelectCounseleeList({
    page,
    size,
    name: searchKeyword,
    birthDates: filter.birthDates,
    affiliatedWelfareInstitutions: filter.affiliatedWelfareInstitutions,
  });

  const createCounselee = useCreateCounseleeInfo();
  const updateCounselee = useUpdateCounseleeInfo();
  const deleteCounseleeInfo = useDeleteCounseleeInfo();

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearch = useCallback(() => {
    setSearchKeyword(filter.name);
    setPage(0);
    refetch();
  }, [filter.name, refetch]);

  const handleBirthDatesClick = useCallback(async () => {
    if (filterOptions.birthDatesOptions.length === 0) {
      await fetchBirthDates();
    }
  }, [filterOptions.birthDatesOptions.length, fetchBirthDates]);

  const handleInstitutionsClick = useCallback(async () => {
    if (filterOptions.institutionsOptions.length === 0) {
      await fetchInstitutions();
    }
  }, [filterOptions.institutionsOptions.length, fetchInstitutions]);

  const handleDelete = useCallback(
    (id: string) => {
      if (id && window.confirm('정말로 이 내담자를 삭제하시겠습니까?')) {
        deleteCounseleeInfo.mutate([{ counseleeId: id }], {
          onSuccess: () => refetch(),
          onError: () => window.alert('내담자 삭제에 실패했습니다.'),
        });
      }
    },
    [deleteCounseleeInfo, refetch],
  );

  const handleEdit = useCallback((counselee: SelectCounseleeRes) => {
    // 편집 다이얼로그는 상위 컴포넌트에서 처리
    return counselee;
  }, []);

  const handleUpdate = useCallback(
    async (formData: AddCounseleeFormData) => {
      try {
        await updateCounselee.mutateAsync(
          {
            counseleeId: formData.id as string,
            ...formData,
          },
          {
            onSuccess: () => {
              refetch();
            },
          },
        );
      } catch (error) {
        console.error('내담자 수정 실패:', error);
        throw error;
      }
    },
    [updateCounselee, refetch],
  );

  const handleCreate = useCallback(
    async (formData: AddCounseleeFormData) => {
      try {
        await createCounselee.mutateAsync(formData, {
          onSuccess: () => {
            refetch();
          },
        });
      } catch (error) {
        console.error('내담자 생성 실패:', error);
        throw error;
      }
    },
    [createCounselee, refetch],
  );

  return {
    page,
    size,
    data,
    filter,
    filterOptions,
    handlePageChange,
    handleSearch,
    handleBirthDatesClick,
    handleInstitutionsClick,
    handleDelete,
    handleEdit,
    handleUpdate,
    handleCreate,
    setFilter,
  };
};
