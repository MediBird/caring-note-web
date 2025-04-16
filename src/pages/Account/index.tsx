import { Header } from '../../components/ui/Header';
import { AccountTableSection } from './components/AccountTableSection';

const AccountManagement = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 페이지 헤더 */}
      <Header title="계정 관리" description="상담약사 정보 확인 및 권한 관리" />

      {/* 메인 콘텐츠 */}
      <div className="mx-auto flex w-full max-w-layout justify-center px-layout pt-5">
        <div className="flex w-full flex-col gap-5">
          {/* 테이블 섹션 */}
          <AccountTableSection />
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
