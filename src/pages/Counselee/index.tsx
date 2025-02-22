import {
  useSelectCounseleeList,
  useDeleteCounseleeInfo,
  useCreateCounseleeInfo,
  useUpdateCounseleeInfo,
} from './hooks/query/useCounseleeInfoQuery';
import { SelectCounseleeRes } from '@/api/api';
import { CounseleeTable } from './components/table/CounseleeTable';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  useCounseleeInfoStore,
  selectNameFilter,
  selectBirthDates,
  selectAffiliatedInstitutions,
} from './hooks/store/counseleeInfoStore';
import TableFilter from '@/components/common/DataTable/table-filter';
import { useCounseleeOptionsStore } from './hooks/store/counseleeOptionsStore';
import { SearchInput } from './components/SearchInput';
import {
  CounseleeDialog,
  AddCounseleeFormData,
} from './components/dialog/CounseleeDialog';

const CounseleeManagement = () => {
  const [page, setPage] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [size, setSize] = useState(10);

  const nameFilter = useCounseleeInfoStore(selectNameFilter);
  const birthDatesFilter = useCounseleeInfoStore(selectBirthDates);
  const institutionsFilter = useCounseleeInfoStore(
    selectAffiliatedInstitutions,
  );

  const setNameFilter = useCounseleeInfoStore((state) => state.setNameFilter);
  const setBirthDatesFilter = useCounseleeInfoStore(
    (state) => state.setBirthDatesFilter,
  );
  const setAffiliatedWelfareInstitutionsFilter = useCounseleeInfoStore(
    (state) => state.setAffiliatedWelfareInstitutionsFilter,
  );

  const {
    birthDatesOptions,
    institutionsOptions,
    fetchBirthDates,
    fetchInstitutions,
  } = useCounseleeOptionsStore();

  const { data, refetch } = useSelectCounseleeList({
    page,
    size,
    name: nameFilter || undefined,
    birthDates: birthDatesFilter.length > 0 ? birthDatesFilter : undefined,
    affiliatedWelfareInstitutions:
      institutionsFilter.length > 0 ? institutionsFilter : undefined,
  });

  const createCounselee = useCreateCounseleeInfo();
  const updateCounselee = useUpdateCounseleeInfo();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = () => {
    refetch();
  };

  const SurveyHeader = () => (
    <div>
      <div className=" bg-white h-fit">
        <div className="pl-[5.75rem] pt-10 pb-1 border-b border-grayscale-05 flex justify-between">
          <div>
            <div className="text-h3 font-bold">내담자 관리</div>
            <div className="mt-1 mb-5 flex items-center text-body2 font-medium text-grayscale-60">
              복약 상담소를 방문하는 모든 내담자의 정보
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MainContent = () => {
    const [editingCounselee, setEditingCounselee] =
      useState<SelectCounseleeRes | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const deleteCounseleeInfo = useDeleteCounseleeInfo();

    const onDelete = (id: string) => {
      if (id && window.confirm('정말로 이 내담자를 삭제하시겠습니까?')) {
        deleteCounseleeInfo.mutate([{ counseleeId: id }], {
          onSuccess: () => refetch(),
          onError: () => window.alert('내담자 삭제에 실패했습니다.'),
        });
      }
    };

    const handleBirthDatesClick = async () => {
      if (birthDatesOptions.length === 0) {
        await fetchBirthDates();
      }
    };

    const handleInstitutionsClick = async () => {
      if (institutionsOptions.length === 0) {
        await fetchInstitutions();
      }
    };

    const handleEdit = (counselee: SelectCounseleeRes) => {
      setEditingCounselee(counselee);
      setIsEditDialogOpen(true);
    };

    const handleUpdate = async (formData: AddCounseleeFormData) => {
      try {
        await updateCounselee.mutateAsync(
          {
            counseleeId: editingCounselee?.id as string,
            ...formData,
          },
          {
            onSuccess: () => {
              refetch();
              setEditingCounselee(null);
              setIsEditDialogOpen(false);
            },
          },
        );
      } catch (error) {
        console.error('내담자 수정 실패:', error);
      }
    };

    return (
      <div className="w-full h-full rounded-[0.5rem] items-center flex flex-col p-5">
        <div className="w-full h-full rounded-[0.5rem] flex justify-between pb-5">
          <div className="flex gap-4">
            <SearchInput
              value={nameFilter}
              onChange={setNameFilter}
              onSearch={handleSearch}
            />
            <TableFilter
              title="생년월일"
              options={birthDatesOptions}
              onSelectionChange={setBirthDatesFilter}
              onOpen={handleBirthDatesClick}
            />
            <TableFilter
              title="연계기관"
              options={institutionsOptions}
              onSelectionChange={setAffiliatedWelfareInstitutionsFilter}
              onOpen={handleInstitutionsClick}
            />
          </div>
          <CounseleeDialog
            onSubmit={(data) => {
              createCounselee.mutate(data, {
                onSuccess: () => refetch(),
              });
            }}
          />
        </div>
        <div className="flex flex-col w-full h-full">
          <CounseleeTable
            data={data?.content || []}
            onDelete={onDelete}
            onEdit={handleEdit}
          />
          {editingCounselee && (
            <CounseleeDialog
              mode="edit"
              initialData={editingCounselee}
              onSubmit={handleUpdate}
              open={isEditDialogOpen}
              onOpenChange={(open) => {
                setIsEditDialogOpen(open);
                if (!open) setEditingCounselee(null);
              }}
            />
          )}
          <div className="flex flex-col items-center gap-4 mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange((data?.pagination?.currentPage ?? 0) - 1)
                    }
                    className={
                      !data?.pagination?.hasPrevious
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
                {Array.from({ length: data?.pagination?.totalPages || 0 }).map(
                  (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(i)}
                        isActive={data?.pagination?.currentPage === i}
                        className="rounded-full w-[30px] h-[30px] font-light flex items-center justify-center"
                        size="md">
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange((data?.pagination?.currentPage ?? 0) + 1)
                    }
                    className={
                      !data?.pagination?.hasNext
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="sticky top-0 z-10">
        <SurveyHeader />
      </div>
      <div className="flex justify-center pt-10">
        <div className="max-w-[120rem]">
          <div className="h-full px-25">
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounseleeManagement;
