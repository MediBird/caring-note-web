import Footer from '@/components/common/Footer';
import NavigationLeft from '@/components/common/NavigationLeft';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        <NavigationLeft />
        <div className="flex flex-1 flex-col">
          {/* 접근성을 위한 스킵 링크 */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary-50 focus:px-3 focus:py-2 focus:text-white">
            메인 콘텐츠로 건너뛰기
          </a>

          <main
            id="main-content"
            className={cn(
              'min-h-[calc(100vh-80px)] flex-1', // Footer 높이(80px) 제외
              'overflow-auto', // 콘텐츠가 길 때 스크롤 처리
            )}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
