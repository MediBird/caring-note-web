import { DefaultApi } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { AddCounseleeFormData } from '../../components/dialog/CounseleeDialog';
import { useCounseleeStore } from '../store/counseleeInfoStore';
import {
  useDeleteCounseleeInfo,
  useSelectCounseleeList,
  useUpdateCounseleeInfo,
} from './useCounseleeInfoQuery';

const api = new DefaultApi();

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

  const createCounselee = useMutation({
    mutationFn: (data: AddCounseleeFormData) => api.addCounselee(data),
    retry: false,
    onError: () => {
      return;
    },
  });
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
        });
      }
    },
    [deleteCounseleeInfo, refetch],
  );

  const handleUpdate = useCallback(
    async (formData: AddCounseleeFormData) => {
      if (!formData.id) return;

      await updateCounselee.mutateAsync(
        {
          counseleeId: formData.id,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          genderType: formData.genderType,
          address: formData.address,
          note: formData.note,
          careManagerName: formData.careManagerName,
          affiliatedWelfareInstitution: formData.affiliatedWelfareInstitution,
          disability: formData.disability,
        },
        {
          onSuccess: () => {
            refetch();
          },
        },
      );
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
      } catch {
        // 에러는 BaseAPI에서 처리하므로 여기서는 아무것도 하지 않음
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
    handleUpdate,
    handleCreate,
    setFilter,
  };
};
