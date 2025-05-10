import { Header } from '../../components/ui/Header';
import { CounseleeTableSection } from './components/CounseleeTableSection';
import { CreateCounseleeDialog } from './components/dialog/CreateCounseleeDialog';
import { CounseleeFilterSection } from './components/CounseleeFilterSection';

const CounseleeManagement = () => {
  return (
    <div>
      <Header
        title="내담자 관리"
        description="복약 상담소를 방문하는 모든 내담자의 정보"
      />
      <div className="mx-auto flex w-full max-w-layout justify-center px-layout pt-5 [&>*]:max-w-content">
        <div className="flex h-full w-full flex-col items-center rounded-[0.5rem]">
          <div className="flex h-full w-full justify-between rounded-[0.5rem] pb-5">
            <CounseleeFilterSection />
            <CreateCounseleeDialog />
          </div>
          <CounseleeTableSection />
        </div>
      </div>
    </div>
  );
};

export default CounseleeManagement;
