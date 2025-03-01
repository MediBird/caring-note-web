import { useState } from 'react';
import { Header } from '../../components/ui/Header';
import { ScheduleDialog } from './components/dialog/ScheduleDialog';
import { FilterSection } from './components/FilterSection';

const ScheduleManagement = () => {
  const [filter, setFilter] = useState({
    name: '',
    counselors: [] as string[],
    dates: [] as Date[],
  });

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching with filters:', filter);
  };

  return (
    <div>
      <Header title="상담 내역" description="내담자의 복약 상담 내역" />
      <div className="flex justify-center pt-5 max-w-layout px-layout [&>*]:max-w-content mx-auto w-full">
        <div className="w-full h-full rounded-[0.5rem] items-center flex flex-col">
          <div className="w-full h-full rounded-[0.5rem] flex justify-between pb-5">
            <FilterSection
              nameFilter={filter.name}
              setNameFilter={(value) => setFilter({ ...filter, name: value })}
              handleSearch={handleSearch}
              counselors={filter.counselors}
              setCounselors={(values) =>
                setFilter({ ...filter, counselors: values })
              }
              selectedDates={filter.dates}
              setSelectedDates={(dates) => setFilter({ ...filter, dates })}
            />
            <ScheduleDialog mode="add" />
          </div>
          {/* <ScheduleTableSection
            data={data?.content}
            pagination={{
              currentPage: data?.pagination?.currentPage ?? 0,
              totalPages: data?.pagination?.totalPages ?? 1,
              hasPrevious: data?.pagination?.hasPrevious ?? false,
              hasNext: data?.pagination?.hasNext ?? false,
            }}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onPageChange={handlePageChange}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
