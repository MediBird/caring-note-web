import Footer from '@/components/common/Footer';
import NavigationLeft from '@/components/common/NavigationLeft';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <SidebarProvider>
      <div className="flex w-full bg-white">
        <NavigationLeft />
        <div className="flex flex-1 flex-col">
          <main className={cn('min-h-[calc(100vh+80px)] flex-1')}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
