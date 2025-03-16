import { Header } from '../../components/ui/Header';
import { AccountTableSection } from './components/AccountTableSection';



const AccountManagement = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* 페이지 헤더 */}
      <Header title="계정 관리" description="상담약사 정보 확인 및 권한 관리" />

      {/* 메인 콘텐츠 */}
      <div className="flex justify-center pt-5 px-layout max-w-layout mx-auto w-full">
        <div className="flex flex-col gap-5 w-full">


          {/* 테이블 섹션 */}
          <AccountTableSection />
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
