import NavigationLeft from '@/components/NavigationLeft';
import { Outlet } from 'react-router-dom';

// 내담자 관리 레이아웃
function CounseleeManagementLayout() {
  return (
    <div className="flex w-full h-screen">
      <NavigationLeft />

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default CounseleeManagementLayout;
