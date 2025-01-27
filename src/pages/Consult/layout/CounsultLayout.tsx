import NavigationLeft from '@/components/NavigationLeft';
import NavigationRight from '@/components/NavigationRight';
import { Outlet } from 'react-router-dom';

function CounsultLayout() {
  return (
    <div className="flex justify-start w-full h-auto">
      <NavigationLeft />
      <main className="flex-1 pr-16 min-h-screen overflow-auto">
        <Outlet />
      </main>
      <NavigationRight />
    </div>
  );
}

export default CounsultLayout;
