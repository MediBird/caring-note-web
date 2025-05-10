import AdminIcon from '@/assets/icon/24/accountcircle.fiiled.svg?react';
import QuestionIcon from '@/assets/icon/24/help.fiiled.svg?react';
import HomeIcon from '@/assets/icon/24/home.filled.svg?react';
import LogoutIcon from '@/assets/icon/24/logout.outline.svg?react';
import MenuIcon from '@/assets/icon/24/menu.svg?react';
import NoteIcon from '@/assets/icon/24/note.fiiled.svg?react';
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
import { ROLE_TYPE_MAP } from '@/utils/constants';
import { useKeycloak } from '@react-keycloak/web';
import { useLayoutEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const cleanName = (name?: string): string => {
  if (!name) return '';
  return name.trim().replace(/&shy;|­|[\u00AD]/g, '');
};

interface NavigationLeftProps {
  initialOpen?: boolean;
}

const NavigationLeft = ({ initialOpen = true }: NavigationLeftProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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
        roles: ['ROLE_ADMIN', 'ROLE_ASSISTANT', 'ROLE_USER', 'ROLE_NONE'],
        action: null,
      },
      {
        name: '상담 내역',
        collapsedName: '상담내역',
        icon: <NoteIcon width={24} height={24} />,
        route: '/consult/session',
        roles: ['ROLE_ADMIN', 'ROLE_USER'],
        action: null,
      },
      // 기능 구현 전 임시 주석 처리
      // {
      //   name: '메세지 보관함',
      //   collapsedName: '메세지 보관함',
      //   icon: <PaperPlainIcon width={24} height={24} />,
      //   roles: ['ROLE_ADMIN', 'ROLE_ASSISTANT', 'ROLE_USER'],
      // },
      {
        name: '내담자 관리',
        collapsedName: '내담자 관리',
        route: '/admin/counselee',
        icon: <PatientIcon width={24} height={24} />,
        roles: ['ROLE_ADMIN'],
        action: null,
      },
      {
        name: '계정 관리',
        collapsedName: '계정관리',
        route: '/admin/account',
        icon: <AdminIcon width={24} height={24} />,
        roles: ['ROLE_ADMIN'],
        action: null,
      },
    ];

    const footerMenuItems = [
      {
        name: '사용법 · 문의',
        collapsedName: '사용법',
        icon: <QuestionIcon width={24} height={24} />,
        roles: ['ROLE_ADMIN', 'ROLE_ASSISTANT', 'ROLE_USER', 'ROLE_NONE'],
        route: null,
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
        route: null,
        action: () => keycloak.logout(),
        roles: ['ROLE_ADMIN', 'ROLE_ASSISTANT', 'ROLE_USER', 'ROLE_NONE'],
      },
    ];

    return {
      mainMenuItems: baseMenuItems.filter((item) =>
        item.roles.includes(user?.roleType as string),
      ),
      footerMenuItems: footerMenuItems.filter((item) =>
        item.roles.includes(user?.roleType as string),
      ),
    };
  }, [keycloak, user?.roleType]);

  const handleMenuClick = (
    route?: string | null,
    action?: null | (() => void),
  ) => {
    if (action) action();

    if (route) {
      navigate(route);
    }
  };

  useLayoutEffect(() => {
    if (!initialOpen) {
      setOpen(false);
    }
  }, [initialOpen, setOpen]);

  return (
    <Sidebar collapsible="icon" className="z-50 !border-0 shadow-nav-left">
      <SidebarHeader
        className={cn(
          'flex flex-col gap-4 border-b border-grayscale-10 text-left',
          !open && 'gap-0 border-b-0',
        )}>
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex h-fit items-center justify-start p-0',
            !open && 'justify-center',
          )}>
          <MenuIcon width={24} height={24} />
        </button>
        {user && (
          <div
            className={cn(
              'flex max-w-[156px] flex-wrap items-end gap-1.5 transition-opacity duration-1000',
              open ? 'opacity-100' : 'max-h-[0px] opacity-0 duration-0',
            )}>
            <span className="break-words text-subtitle2 font-bold">
              {cleanName(user?.name)}
            </span>
            <span className="break-keep text-body1 font-medium">
              {`${
                ROLE_TYPE_MAP[user?.roleType as keyof typeof ROLE_TYPE_MAP]
              }님`}
            </span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={getIsActive(item.route ?? '')}
                    onClick={() => handleMenuClick(item.route, item.action)}
                    className={cn(
                      'flex flex-row items-center gap-2',
                      !open
                        ? 'flex-col justify-center gap-1 overflow-hidden p-[3px] text-center text-xs font-bold text-grayscale-50 hover:!text-grayscale-70 [&>svg]:text-grayscale-90'
                        : 'text-grayscale-90',
                      getIsActive(item.route ?? '') &&
                        'text-primary-50 [&>svg]:text-primary-50',
                    )}>
                    {item.icon}
                    <span
                      className={cn(
                        'w-full overflow-hidden whitespace-nowrap',
                        !open &&
                          'w-full whitespace-pre-wrap text-center text-body1 font-medium',
                      )}>
                      {open ? item.name : item.collapsedName}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {user && <div className="my-2.5 h-[1px] w-full bg-grayscale-10" />}
            <SidebarMenu>
              {menuItems.footerMenuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item.route, item.action)}
                    className={cn(
                      'flex flex-row items-center gap-2',
                      !open
                        ? 'flex-col justify-center gap-1 overflow-hidden p-[3px] text-center text-xs font-bold text-grayscale-50 hover:!text-grayscale-70 [&>svg]:text-grayscale-90'
                        : 'text-grayscale-90',
                      getIsActive(item.route ?? '') &&
                        'text-primary-50 [&>svg]:text-primary-50',
                    )}>
                    {item.icon}
                    <span
                      className={cn(
                        'w-full overflow-hidden whitespace-nowrap',
                        !open && 'w-full whitespace-pre-wrap text-center',
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
            className="mb-2 h-10 w-auto object-contain"
            height={40}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default NavigationLeft;
