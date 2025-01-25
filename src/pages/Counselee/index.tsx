import TableComponent from '@/components/common/TableComponent';
import { Button } from '@/components/ui/button';
import { GridColDef } from '@mui/x-data-grid';
import addCounselee from '@/assets/icon/24/addcounselee.blue.svg';
import addCalendar from '@/assets/icon/24/addcalendar.blue.svg';
import { useCallback, useEffect, useState } from 'react';
import ItemChange from '@/pages/Counselee/dialogs/ItemChange';
import {
  CounseleeAddDialogTypes,
  CounseleeDeleteDialogTypes,
} from './constants/dialog';
import { useSelectCounseleeList } from './hooks/query/useCounseleeInfoQuery';
import { SelectCounseleeRes } from '@/api/api';

const CounseleeManagement = () => {
  // 페이징 사이즈 상태
  const [size, setSize] = useState(10);
  // 내담자 목록 조회
  const { data: selectCounseleeInfoList, refetch } = useSelectCounseleeList({
    page: 0,
    size: 10,
  });
  // modalType을 상태로 관리
  const [dialogType, setDialogType] = useState<CounseleeAddDialogTypes>(null);
  // 선택된 데이터 상태
  const [selectedData, setSelectedData] = useState<
    CounseleeDeleteDialogTypes[]
  >([]);
  const columns: GridColDef[] = [
    { field: 'name', headerName: '내담자', flex: 1 },
    {
      field: 'disability',
      headerName: '장애 여부',
      flex: 1,
      valueFormatter: (params) => {
        return params ? '장애인' : '비장애인';
      },
    },
    { field: 'dateOfBirth', headerName: '생년월일', flex: 1 },
    {
      field: 'phoneNumber',
      headerName: '연락처',
      flex: 1,
      valueFormatter: (params: string) => {
        return params
          ? `${params.slice(0, 3)}-${params.slice(3, 7)}-${params.slice(7)}`
          : '연락처 없음';
      },
    },
    { field: 'affiliatedWelfareInstitution', headerName: '연계 기관', flex: 1 },
    { field: 'address', headerName: '행정동', flex: 1 },
    { field: 'careManagerName', headerName: '생활지원사', flex: 1 },
    { field: 'note', headerName: '비고', flex: 1 },
  ];

  /* Filter Section 2차 릴리즈 예정 */
  // const options = [
  //   { value: '내담자명', label: '내담자 명' },
  //   { value: '생년월일', label: '생년월일' },
  //   { value: '연계기관', label: '연계 기관' },
  // ];
  // const [selected, setSelected] = React.useState(options[0]);

  // Select 컴포넌트의 value 변경 시 실행되는 함수
  // const handleChange = (value: string) => {
  //   console.log('value', value);

  //   const selectedOption = options.find((option) => option.value === value);
  //   if (selectedOption) {
  //     setSelected(selectedOption);
  //   }
  // };

  // openModal, closeModal 함수
  const openModal = useCallback(
    (type: CounseleeAddDialogTypes) => setDialogType(type),
    [],
  );
  const closeModal = useCallback(() => setDialogType(null), []);

  const handleCellClick = (row: SelectCounseleeRes) => {
    setSelectedData((prevSelectedData) => {
      const updatedSelectedData = [...prevSelectedData];
      const index = updatedSelectedData.findIndex(
        (item) => item.counseleeId === row.id,
      );
      if (index === -1) {
        // 아이디가 없으면 추가
        updatedSelectedData.push({ counseleeId: row.id || '' });
      } else {
        // 아이디가 있으면 삭제
        updatedSelectedData.splice(index, 1);
      }
      return updatedSelectedData;
    });
  };

  // 사이즈 변경 시 데이터 다시 조회
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

  return (
    <div className="p-[2.5rem]">
      <div className="w-full h-[6.25rem] font-bold text-h3 border-b border-grayscale-10 text-grayscale-100 content-center ">
        내담자 관리
      </div>

      <div className="flex justify-center items-center pt-[2rem]">
        <div className="w-full h-full">
          {/* Filter Section 2차 릴리즈 예정 */}
          {/* <div className="w-full h-[3.3125rem] bg-grayscale-3 rounded-[0.5rem] mb-[0.5rem] justify-between flex">
            <div className="flex items-center justify-center">
              <div className="flex gap-3 m-5">
                <div className="flex flex-row items-center gap-1 pr-5">
                  <img src={filter} alt="filter" width={20} />
                  검색
                </div>
                <div className="w-24">
                  <Select
                    value={selected.value}
                    onValueChange={(value) => {
                      handleChange(value);
                    }}>
                    <SelectTrigger className="w-full h-8 p-2 rounded-lg focus:ring-0">
                      <SelectValue>{selected.label}</SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full">
                      <ScrollArea className="w-auto h-auto">
                        {options.map((option, id) => (
                          <SelectItem
                            className="w-24 h-8 rounded-lg"
                            key={`${option.value}-${id}`}
                            value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-24">
                  <Select
                    value={selected.value}
                    onValueChange={(value) => {
                      handleChange(value);
                    }}>
                    <SelectTrigger className="w-full h-8 p-2 rounded-lg focus:ring-0">
                      <SelectValue>{selected.label}</SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full">
                      <ScrollArea className="w-auto h-auto">
                        {options.map((option, id) => (
                          <SelectItem
                            className="w-24 h-8 rounded-lg"
                            key={`${option.value}-${id}`}
                            value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24">
                  <Select
                    value={selected.value}
                    onValueChange={(value) => {
                      handleChange(value);
                    }}>
                    <SelectTrigger className="w-full h-8 p-2 rounded-lg focus:ring-0">
                      <SelectValue>{selected.label}</SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full">
                      <ScrollArea className="w-auto h-auto">
                        {options.map((option, id) => (
                          <SelectItem
                            className="w-24 h-8 rounded-lg"
                            key={`${option.value}-${id}`}
                            value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div> */}

          {/* Table Section */}
          <div className="w-full h-full bg-grayscale-3 rounded-[0.5rem] items-center flex flex-col pl-5 pr-5 pb-5">
            <div className="w-full h-full rounded-[0.5rem] flex justify-between m-5">
              <div className="w-full h-[3.125rem]">
                <div className="text-xl font-bold text-subtitle-2 text-grayscale-90">
                  내담자 정보
                </div>
                <div className="text-sm text-body-2 font-medium text-grayscale-60 h-[1.25rem]">
                  복약 상담소를 방문한 내담자의 인적 정보
                </div>
              </div>
              <div className="w-[22.813rem] h-[3.125rem] flex items-center justify-end gap-3">
                <Button
                  size="lg"
                  variant={
                    selectCounseleeInfoList?.length !== 0
                      ? 'destructive'
                      : 'secondaryError'
                  }
                  className="flex w-[6.813rem] h-[2.5rem] font-bold text-base pl-5 pr-5"
                  disabled={
                    selectCounseleeInfoList?.length == 0 ||
                    selectedData === null
                  }
                  onClick={() => openModal('DELETE')}>
                  선택 삭제
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex w-[8rem] h-[2.5rem] font-bold text-base pl-5 pr-5"
                  onClick={() => openModal('CALENDAR')}>
                  <img
                    src={addCalendar}
                    alt="addCounselee"
                    width={20}
                    className="outline-primary-50"
                  />
                  일정 등록
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex w-[8rem] h-[2.5rem] font-bold text-base pl-5 pr-5"
                  disabled={false}
                  onClick={() => openModal('COUNSELEE')}>
                  <img src={addCounselee} alt="addCounselee" width={20} />
                  내담자 등록
                </Button>
              </div>
            </div>
            <div className="flex flex-col w-full h-auto">
              <TableComponent
                tableKey="client-management"
                rows={selectCounseleeInfoList || []}
                columns={columns}
                checkboxSelection={true}
                onCellClick={(cell) => handleCellClick(cell.row)}
              />
            </div>
          </div>
        </div>
      </div>
      <ItemChange
        isOpen={dialogType !== null}
        dialogType={dialogType}
        onClose={closeModal}
        selectedData={selectedData as CounseleeDeleteDialogTypes[]}
      />
    </div>
  );
};

export default CounseleeManagement;
