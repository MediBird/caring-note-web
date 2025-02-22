import {
  useSelectCounseleeList,
  useDeleteCounseleeInfo,
} from './hooks/query/useCounseleeInfoQuery';
import { SelectCounseleeRes } from '@/api/api';
import { CounseleeTable } from './components/table/counseleeTable';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

const CounseleeManagement = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data, refetch } = useSelectCounseleeList({
    page,
    size,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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

  // 메인 컨텐츠 영역
  const MainContent = ({
    data,
  }: {
    data: {
      content: SelectCounseleeRes[];
      pagination: {
        totalPages: number;
        totalElements: number;
        currentPage: number;
        hasNext: boolean;
        hasPrevious: boolean;
      };
    };
  }) => {
    const deleteCounseleeInfo = useDeleteCounseleeInfo();

    const onDelete = (id: string) => {
      if (id && window.confirm('정말로 이 내담자를 삭제하시겠습니까?')) {
        deleteCounseleeInfo.mutate([{ counseleeId: id }], {
          onSuccess: () => refetch(),
          onError: () => window.alert('내담자 삭제에 실패했습니다.'),
        });
      }
    };

    return (
      <div className="w-full h-fullrounded-[0.5rem] items-center flex flex-col p-5">
        <div className="w-full h-full rounded-[0.5rem] flex justify-between pb-5">
          <div className="w-full"></div>
          <Button variant="secondary" size="lg">
            <img
              src="/src/assets/icon/20/personadd.svg"
              alt="plus"
              className="h-5 w-5"
            />
            내담자 등록
          </Button>
        </div>
        <div className="flex flex-col w-full h-full">
          <CounseleeTable data={data.content || []} onDelete={onDelete} />
          <div className="flex flex-col items-center gap-4 mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(data.pagination.currentPage - 1)
                    }
                    className={
                      !data.pagination.hasPrevious
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
                {Array.from({ length: data.pagination.totalPages }).map(
                  (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(i)}
                        isActive={data.pagination.currentPage === i}
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
                      handlePageChange(data.pagination.currentPage + 1)
                    }
                    className={
                      !data.pagination.hasNext
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
            <MainContent
              data={{
                content: data?.content || [],
                pagination: {
                  totalPages: data?.pagination?.totalPages || 0,
                  totalElements: data?.pagination?.totalElements || 0,
                  currentPage: data?.pagination?.currentPage || 0,
                  hasNext: data?.pagination?.hasNext || false,
                  hasPrevious: data?.pagination?.hasPrevious || false,
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounseleeManagement;
