import { useCallback, useMemo, useState } from 'react';
import { AddCounseleeFormData } from '../components/dialog/CounseleeDialog';
import {
  useCreateCounseleeInfo,
  useDeleteCounseleeInfo,
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

  // 스토어 사용
  const { filter, setFilter: originalSetFilter } = useFilterStore();

  // 필터 변경 시 페이지 리셋하는 래퍼 함수
  const setFilter = useCallback(
    (newFilter: Partial<typeof filter>) => {
      originalSetFilter(newFilter);
      setPage(0); // 필터 변경 시 페이지를 0으로 리셋
    },
    [originalSetFilter],
  );

  // 필터 이름이 한글 또는 영어인지 확인하는 함수
  const isValidName = useCallback((name: string | undefined) => {
    if (!name) return false;
    // 한글 또는 영어만 포함되어 있는지 확인 (공백 허용)
    const koreanRegex = /^[가-힣\s]+$/;
    const englishRegex = /^[a-zA-Z\s]+$/;
    return koreanRegex.test(name) || englishRegex.test(name);
  }, []);

  // 유효한 이름 필터 설정
  const validNameFilter = useMemo(() => {
    return isValidName(filter.name) ? filter.name : undefined;
  }, [filter.name, isValidName]);

  // 쿼리 사용
  const { data: birthDatesData, refetch: refetchBirthDates } =
    useBirthDatesQuery();
  const { data: institutionsData, refetch: refetchInstitutions } =
    useInstitutionsQuery();

  // 뮤테이션 사용
  const createCounselee = useCreateCounseleeInfo();
  const updateCounselee = useUpdateCounseleeInfo();
  const deleteCounseleeInfo = useDeleteCounseleeInfo();

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

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
          isDisability: formData.isDisability,
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
        await createCounselee.mutateAsync(
          {
            name: formData.name,
            dateOfBirth: formData.dateOfBirth,
            genderType: formData.genderType,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            note: formData.note,
            careManagerName: formData.careManagerName,
            affiliatedWelfareInstitution: formData.affiliatedWelfareInstitution,
            isDisability: formData.isDisability,
          },
          {
            onSuccess: () => {
              refetch();
              refetchBirthDates();
              refetchInstitutions();
            },
          },
        );
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
    handleDelete,
    handleUpdate,
    handleCreate,
    setFilter,
  };
};
