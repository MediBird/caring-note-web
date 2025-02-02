import NavigationLeft from '@/components/NavigationLeft';
import NavigationRight from '@/components/NavigationRight';
import { Outlet } from 'react-router-dom';

function CounsultLayout() {
  return (
    <div className="flex w-full h-screen">
      <NavigationLeft />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <NavigationRight />
    </div>
  );
}

export default CounsultLayout;
