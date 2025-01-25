import NavigationLeft from '@/components/NavigationLeft';
import { Outlet } from 'react-router-dom';

// 내담자 관리 레이아웃
function CounseleeManagementLayout() {
  return (
    <div className="flex justify-start w-full h-auto">
      <NavigationLeft />

      <div className="w-full min-h-screen pr-16">
        <Outlet />
      </div>
    </div>
  );
}

export default CounseleeManagementLayout;
