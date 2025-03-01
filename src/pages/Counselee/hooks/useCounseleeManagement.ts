import { useCallback, useState } from 'react';
import { AddCounseleeFormData } from '../components/dialog/CounseleeDialog';
import {
  useCreateCounseleeInfo,
  useDeleteCounseleeInfo,
  useSelectCounseleeList,
  useUpdateCounseleeInfo,
} from './queries/useCounseleeQuery';
import {
  useBirthDatesQuery,
  useInstitutionsQuery,
} from './queries/useFilterOptionsQuery';
import { useFilterStore } from './stores/useFilterStore';

export const useCounseleeManagement = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 스토어 사용
  const { filter, setFilter } = useFilterStore();

  // 쿼리 사용
  const { data: birthDatesData, refetch: refetchBirthDates } =
    useBirthDatesQuery();
  const { data: institutionsData, refetch: refetchInstitutions } =
    useInstitutionsQuery();
  const { data, refetch } = useSelectCounseleeList({
    page,
    size,
    name: searchKeyword,
    birthDates: filter.birthDates,
    affiliatedWelfareInstitutions: filter.affiliatedWelfareInstitutions,
  });

  // 뮤테이션 사용
  const createCounselee = useCreateCounseleeInfo();
  const updateCounselee = useUpdateCounseleeInfo();
  const deleteCounseleeInfo = useDeleteCounseleeInfo();

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearch = useCallback(() => {
    const namePattern = /^[가-힣a-zA-Z\s]*$/;

    if (namePattern.test(filter.name)) {
      setSearchKeyword(filter.name);
      setPage(0);
      refetch();
    }
  }, [filter.name, refetch]);

  const handleDelete = useCallback(
    (id: string) => {
      if (id && window.confirm('정말로 이 내담자를 삭제하시겠습니까?')) {
        deleteCounseleeInfo.mutate([{ counseleeId: id }], {
          onSuccess: () => {
            refetch();
            refetchBirthDates();
            refetchInstitutions();
          },
        });
      }
    },
    [deleteCounseleeInfo, refetch, refetchBirthDates, refetchInstitutions],
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
          isDisability: formData.disability,
        },
        {
          onSuccess: () => {
            refetch();
            refetchBirthDates();
            refetchInstitutions();
          },
        },
      );
    },
    [updateCounselee, refetch, refetchBirthDates, refetchInstitutions],
  );

  const handleCreate = useCallback(
    async (formData: AddCounseleeFormData) => {
      try {
        await createCounselee.mutateAsync(formData, {
          onSuccess: () => {
            refetch();
            refetchBirthDates();
            refetchInstitutions();
          },
        });
      } catch {
        // 에러는 BaseAPI에서 처리하므로 여기서는 아무것도 하지 않음
      }
    },
    [createCounselee, refetch, refetchBirthDates, refetchInstitutions],
  );

  const filterOptions = {
    birthDatesOptions: birthDatesData || [],
    institutionsOptions: institutionsData || [],
  };

  return {
    page,
    size,
    data,
    filter,
    filterOptions,
    handlePageChange,
    handleSearch,
    handleDelete,
    handleUpdate,
    handleCreate,
    setFilter,
  };
};
