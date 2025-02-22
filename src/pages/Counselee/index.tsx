import {
  useSelectCounseleeList,
  useDeleteCounseleeInfo,
} from './hooks/query/useCounseleeInfoQuery';
import { SelectCounseleeRes } from '@/api/api';
import { CounseleeTable } from './components/table/CounseleeTable';
import { useEffect, useState } from 'react';

const CounseleeManagement = () => {
  // 페이징 사이즈 상태
  const [size, setSize] = useState(10);
  // 내담자 목록 조회
  const { data: selectCounseleeInfoList, refetch } = useSelectCounseleeList({
    page: 0,
    size: 10,
  });

  useEffect(() => {
    if (selectCounseleeInfoList) {
      // 내담자 목록 사이즈 변경
      setSize(selectCounseleeInfoList.length);
    }
  }, [selectCounseleeInfoList]);

  // page 또는 size 변경 시 데이터 다시 조회
  useEffect(() => {
    refetch();
  }, [size, refetch]);

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
    selectCounseleeInfoList,
  }: {
    selectCounseleeInfoList: SelectCounseleeRes[];
  }) => {
    const deleteCounseleeInfo = useDeleteCounseleeInfo();

    const onDelete = (id: string) => {
      if (id) {
        if (window.confirm('정말로 이 내담자를 삭제하시겠습니까?')) {
          deleteCounseleeInfo.mutate([{ counseleeId: id }], {
            onSuccess: () => {
              refetch();
            },
            onError: () => {
              window.alert('내담자 삭제에 실패했습니다.');
            },
          });
        }
      }
    };

    return (
      <div className="w-full h-full bg-grayscale-3 rounded-[0.5rem] items-center flex flex-col p-5">
        <div className="w-full h-full rounded-[0.5rem] flex justify-between mb-5">
          <div className="w-full h-[3.125rem]">
            <div className="text-xl font-bold text-subtitle-2 text-grayscale-90">
              내담자 정보
            </div>
            <div className="text-sm text-body-2 font-medium text-grayscale-60 h-[1.25rem]">
              복약 상담소를 방문한 내담자의 인적 정보
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <CounseleeTable
            data={selectCounseleeInfoList || []}
            onDelete={onDelete}
          />
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
              selectCounseleeInfoList={selectCounseleeInfoList || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounseleeManagement;
