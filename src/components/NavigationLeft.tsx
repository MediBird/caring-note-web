import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigationStore } from '@/store/navigationStore';
import NavigationLeftMenu from '@/components/NavigationLeftMenu';

import AdminBlackIcon from '@/assets/icon/24/accountcircle.fiiled.black.svg?react';
import AdminBlueIcon from '@/assets/icon/24/accountcircle.fiiled.blue.svg?react';
import QuestionBlackIcon from '@/assets/icon/24/help.fiiled.black.svg?react';
import HomeBlackIcon from '@/assets/icon/24/home.filled.black.svg?react';
import HomeBlueIcon from '@/assets/icon/24/home.filled.blue.svg?react';
import LogoutBlackIcon from '@/assets/icon/24/logout.outline.black.svg?react';
import NoteBlackIcon from '@/assets/icon/24/note.fiiled.black.svg?react';
import NoteBlueIcon from '@/assets/icon/24/note.fiiled.blue.svg?react';
import PaperPlainBlackIcon from '@/assets/icon/24/paperplane.black.svg?react';
import PaperPlainBlueIcon from '@/assets/icon/24/paperplane.blue.svg?react';
import PatientBlackIcon from '@/assets/icon/24/patient.fiiled.black.svg?react';
import PatientBlueIcon from '@/assets/icon/24/patient.fiiled.blue.svg?react';
import logoBlack from '@/assets/logoBlack.png';

const NavigationLeft = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { keycloak } = useKeycloak();

  // Zustand 상태 가져오기
  const activeMenu = useNavigationStore((state) => state.activeMenu);
  const setActiveMenu = useNavigationStore((state) => state.setActiveMenu);

  // 메뉴 데이터 타입과 정의
  const menuItems = useMemo(
    () => [
      {
        name: '홈',
        route: '/',
        icon: <HomeBlackIcon width={24} height={24} />,
        activeIcon: <HomeBlueIcon width={24} height={24} />,
      },
      {
        name: '상담노트',
        icon: <NoteBlackIcon width={24} height={24} />,
        activeIcon: <NoteBlueIcon width={24} height={24} />,
      },
      {
        name: '케어링노트',
        icon: <PaperPlainBlackIcon width={24} height={24} />,
        activeIcon: <PaperPlainBlueIcon width={24} height={24} />,
      },
      {
        name: '내담자관리',
        route: '/counselee-management',
        icon: <PatientBlackIcon width={24} height={24} />,
        activeIcon: <PatientBlueIcon width={24} height={24} />,
      },
      {
        name: '계정관리',
        icon: <AdminBlackIcon width={24} height={24} />,
        activeIcon: <AdminBlueIcon width={24} height={24} />,
      },
      {
        name: '도움말',
        icon: <QuestionBlackIcon width={24} height={24} />,
      },
      {
        name: '로그아웃',
        icon: <LogoutBlackIcon width={24} height={24} />,
        action: () => keycloak.logout(),
      },
    ],
    [keycloak],
  );

  // 새로고침 시 현재 URL 경로에 맞는 메뉴 설정
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedMenu = menuItems.find((menu) => menu.route === currentPath);
    if (matchedMenu) {
      setActiveMenu(matchedMenu.name);
    }
  }, [setActiveMenu, menuItems]);

  const handleMenuClick = (
    menuName: string,
    route?: string,
    action?: () => void,
  ) => {
    setActiveMenu(menuName);
    if (action) action();
    if (route) navigate(route);
  };

  return (
    <div className="relative h-auto py-0 w-52 bg-grayscale-3 z-10 shadow-nav-left">
      {/* 사용자 정보 */}
      <div className="flex items-end p-5">
        <span className="whitespace-nowrap">
          <span className="text-subtitle2 font-bold">{user?.name ?? ''}</span>
          <span className="text-body1 font-medium">{`${(() => {
            switch (user?.roleType) {
              case 'ROLE_ADMIN':
                return '관리자';
              case 'ROLE_ASSISTANT':
                return '상담사';
              case 'ROLE_USER':
                return '약사';
              default:
                return '';
            }
          })()}님`}</span>
        </span>
      </div>
      <hr className="border-t border-grayscale-10" />

      {/* 메뉴 렌더링 */}
      {menuItems.map((menu) => (
        <NavigationLeftMenu
          key={menu.name}
          isActive={activeMenu === menu.name}
          menuIcon={menu.icon}
          activteMenuIcon={menu.activeIcon}
          menuName={menu.name}
          onClick={() => handleMenuClick(menu.name, menu.route, menu.action)}
        />
      ))}

      {/* 하단 로고 */}
      <div className="absolute flex items-center justify-center w-full bottom-5">
        <img
          className="hover:cursor-pointer"
          src={logoBlack}
          alt="logo"
          onClick={() => handleMenuClick('홈', '/')}
        />
      </div>
    </div>
  );
};

export default NavigationLeft;
