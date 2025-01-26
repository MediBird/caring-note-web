import NavigationLeft from '@/components/NavigationLeft';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex justify-start w-full h-auto">
      <NavigationLeft />
      <div className=" w-full min-h-screen ">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
