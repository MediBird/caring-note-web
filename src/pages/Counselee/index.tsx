import { Header } from '../../components/ui/Header';
import { CounseleeTableSection } from './components/CounseleeTableSection';
import { CounseleeDialog } from './components/dialog/CounseleeDialog';
import { FilterSection } from './components/FilterSection';
import { useCounseleeManagement } from './hooks/useCounseleeManagement';

const CounseleeManagement = () => {
  const {
    data,
    filter,
    filterOptions,
    handlePageChange,
    handleDelete,
    handleUpdate,
    handleCreate,
    setFilter,
  } = useCounseleeManagement();

  return (
    <div>
      <Header
        title="내담자 관리"
        description="복약 상담소를 방문하는 모든 내담자의 정보"
      />
      <div className="mx-auto flex w-full max-w-layout justify-center px-layout pt-5 [&>*]:max-w-content">
        <div className="flex h-full w-full flex-col items-center rounded-[0.5rem]">
          <div className="flex h-full w-full justify-between rounded-[0.5rem] pb-5">
            <FilterSection
              nameFilter={filter.name}
              setNameFilter={(value) => setFilter({ name: value })}
              birthDatesFilter={filter.birthDates}
              setBirthDatesFilter={(values) =>
                setFilter({ birthDates: values })
              }
              institutionsFilter={filter.affiliatedWelfareInstitutions}
              setInstitutionsFilter={(values) =>
                setFilter({ affiliatedWelfareInstitutions: values })
              }
              birthDatesOptions={filterOptions.birthDatesOptions}
              institutionsOptions={filterOptions.institutionsOptions}
            />
            <CounseleeDialog onSubmit={handleCreate} />
          </div>
          <CounseleeTableSection
            data={data?.content}
            pagination={{
              currentPage: data?.page ?? 0,
              totalPages: data?.totalPages ?? 1,
              hasPrevious: data?.hasPrevious ?? false,
              hasNext: data?.hasNext ?? false,
            }}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CounseleeManagement;
