import NavigationLeft from '@/components/common/NavigationLeft';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-auto w-full justify-start bg-white">
        <NavigationLeft />
        <main className={cn('flex-1 overflow-x-auto overflow-y-hidden')}>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
