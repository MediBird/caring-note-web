import AdminIcon from '@/assets/icon/24/accountcircle.fiiled.svg?react';
import QuestionIcon from '@/assets/icon/24/help.fiiled.svg?react';
import HomeIcon from '@/assets/icon/24/home.filled.svg?react';
import LogoutIcon from '@/assets/icon/24/logout.outline.svg?react';
import MenuIcon from '@/assets/icon/24/menu.svg?react';
import NoteIcon from '@/assets/icon/24/note.fiiled.svg?react';
import PaperPlainIcon from '@/assets/icon/24/paperplane.svg?react';
import PatientIcon from '@/assets/icon/24/patient.fiiled.svg?react';
import TextLogo from '@/assets/text-logo.webp';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuthContext } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useKeycloak } from '@react-keycloak/web';
import { useLayoutEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationLeftProps {
  initialOpen?: boolean;
}

const NavigationLeft = ({ initialOpen = true }: NavigationLeftProps) => {
  const navigate = useNavigate();

  const { toggleSidebar, open, setOpen } = useSidebar();

  const { user } = useAuthContext();
  const { keycloak } = useKeycloak();

  const getIsActive = (route: string) => {
    return location.pathname === route;
  };

  // 메뉴 데이터 타입과 정의
  const menuItems = useMemo(() => {
    const baseMenuItems = [
      {
        name: '홈',
        collapsedName: '홈',
        route: '/',
        icon: <HomeIcon width={24} height={24} />,
        roles: ['ROLE_ADMIN', 'ROLE_ASSISTANT', 'ROLE_USER'],
      },
      {
        name: '상담 내역',
        collapsedName: '상담내역',
        icon: <NoteIcon width={24} height={24} />,
        route: '/admin/session',
        roles: ['ROLE_ADMIN'],
      },
      {
        name: '메세지 보관함',
        collapsedName: '메세지 보관함',
        icon: <PaperPlainIcon width={24} height={24} />,
        roles: ['ROLE_ADMIN', 'ROLE_ASSISTANT', 'ROLE_USER'],
      },
      {
        name: '내담자 관리',
        collapsedName: '내담자 관리',
        route: '/admin/counselee',
        icon: <PatientIcon width={24} height={24} />,
        roles: ['ROLE_ADMIN', 'ROLE_USER'],
      },
      {
        name: '계정 관리',
        collapsedName: '계정관리',
        route: '/admin/account',
        icon: <AdminIcon width={24} height={24} />,
        roles: ['ROLE_ADMIN'],
      },
      {
        name: '사용법 · 문의',
        collapsedName: '사용법',
        icon: <QuestionIcon width={24} height={24} />,
        roles: ['ROLE_ADMIN', 'ROLE_ASSISTANT', 'ROLE_USER'],
        action: () =>
          window.open(
            'https://www.notion.so/yoonyounglee/19a4b68481fb802db0fef7bbf9e35afb?pvs=4',
            '_blank',
          ),
      },
      {
        name: '로그아웃',
        collapsedName: '로그아웃',
        icon: <LogoutIcon width={24} height={24} />,
        action: () => keycloak.logout(),
        roles: ['ROLE_ADMIN', 'ROLE_ASSISTANT', 'ROLE_USER'],
      },
    ];

    return baseMenuItems.filter((item) =>
      item.roles.includes(user?.roleType as string),
    );
  }, [keycloak, user?.roleType]);

  const handleMenuClick = (route?: string, action?: () => void) => {
    if (action) action();
    if (route) navigate(route);
  };

  useLayoutEffect(() => {
    if (!initialOpen) {
      setOpen(false);
    }
  }, [initialOpen, setOpen]);

  return (
    <Sidebar collapsible="icon" className="shadow-nav-left !border-0 z-50 ">
      <SidebarHeader
        className={cn(
          'border-b border-grayscale-10 flex flex-col gap-4 text-left',
          !open && 'gap-0 border-b-0',
        )}>
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-0 h-fit flex justify-start items-center',
            !open && 'justify-center',
          )}>
          <MenuIcon width={24} height={24} />
        </button>
        {user && (
          <div
            className={cn(
              'flex flex-wrap max-w-[156px] transition-opacity duration-1000 items-end gap-1.5',
              open ? 'opacity-100' : 'max-h-[0px] opacity-0 duration-0',
            )}>
            <span className="text-subtitle2 font-bold break-words">
              {user?.name?.trim() ?? ''}
            </span>
            <span className="text-body1 font-medium break-keep">
              {`${
                roleNameMapByRoleType[
                  user?.roleType as keyof typeof roleNameMapByRoleType
                ]
              }님`}
            </span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(0, 5).map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={getIsActive(item.route ?? '')}
                    onClick={() => handleMenuClick(item.route, item.action)}
                    className={cn(
                      'flex items-center gap-2 flex-row',
                      !open
                        ? 'justify-center flex-col text-xs text-center p-[3px] overflow-hidden gap-1 font-bold text-grayscale-50 hover:!text-grayscale-70 [&>svg]:text-grayscale-90'
                        : 'text-grayscale-90',
                      getIsActive(item.route ?? '') &&
                        'text-primary-50 [&>svg]:text-primary-50',
                    )}>
                    {item.icon}
                    <span
                      className={cn(
                        'overflow-hidden whitespace-nowrap w-full',
                        !open && 'text-center w-full whitespace-pre-wrap',
                      )}>
                      {open ? item.name : item.collapsedName}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {user && <div className="h-[1px] my-2.5 bg-grayscale-10 w-full" />}
            <SidebarMenu>
              {menuItems.slice(5).map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item.route, item.action)}
                    className={cn(
                      'flex items-center gap-2 flex-row',
                      !open
                        ? 'justify-center flex-col text-xs text-center p-[3px] overflow-hidden gap-1 font-bold text-grayscale-50 hover:!text-grayscale-70 [&>svg]:text-grayscale-90'
                        : 'text-grayscale-90',
                      getIsActive(item.route ?? '') &&
                        'text-primary-50 [&>svg]:text-primary-50',
                    )}>
                    {item.icon}
                    <span
                      className={cn(
                        'overflow-hidden whitespace-nowrap w-full',
                        !open && 'text-center w-full whitespace-pre-wrap',
                      )}>
                      {open ? item.name : item.collapsedName}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {open && (
          <img
            src={TextLogo}
            alt="logo"
            className="h-10 w-auto object-contain mb-2"
            height={40}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default NavigationLeft;

const roleNameMapByRoleType: Record<string, string> = {
  ROLE_NONE: '',
  ROLE_ADMIN: '관리자',
  ROLE_ASSISTANT: '상담사',
  ROLE_USER: '약사',
};
