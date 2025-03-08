import NavigationLeft from '@/components/common/NavigationLeft';
import NavigationRight from '@/components/NavigationRight';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
function Layout() {
  const location = useLocation();

  const isSidebarOpen = useMemo(() => {
    const isSurvey = location.pathname.includes('/survey');

    if (isSurvey) {
      return false;
    }

    return true;
  }, [location.pathname]);

  const isRightSideBarActive = useMemo(() => {
    const isConsult = location.pathname.includes('/consult');

    if (isConsult) {
      return true;
    }

    return false;
  }, [location.pathname]);

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <div className="flex justify-start w-full h-auto">
        <NavigationLeft />
        <main
          className={cn(
            'flex-1 overflow-auto',
            isRightSideBarActive ? 'pr-[50px]' : '',
          )}>
          <Outlet />
        </main>
        {isRightSideBarActive && <NavigationRight />}
      </div>
    </SidebarProvider>
  );
}

export default Layout;
