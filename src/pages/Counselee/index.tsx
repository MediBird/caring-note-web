import { CounseleeTableSection } from './components/CounseleeTableSection';
import { CounseleeDialog } from './components/dialog/CounseleeDialog';
import { FilterSection } from './components/FilterSection';
import { Header } from './components/Header';
import { useCounseleeManagement } from './hooks/query/useCounseleeManagement';

const CounseleeManagement = () => {
  const {
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
  } = useCounseleeManagement();

  return (
    <div>
      <Header
        title="내담자 관리"
        description="복약 상담소를 방문하는 모든 내담자의 정보"
      />
      <div className="flex justify-center pt-10">
        <div className="max-w-[120rem]">
          <div className="h-full px-25">
            <div className="w-full h-full rounded-[0.5rem] items-center flex flex-col p-5">
              <div className="w-full h-full rounded-[0.5rem] flex justify-between pb-5">
                <FilterSection
                  nameFilter={filter.name}
                  setNameFilter={(value) => setFilter({ name: value })}
                  handleSearch={handleSearch}
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
                  onBirthDatesClick={handleBirthDatesClick}
                  onInstitutionsClick={handleInstitutionsClick}
                />
                <CounseleeDialog onSubmit={handleCreate} />
              </div>
              <CounseleeTableSection
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounseleeManagement;
