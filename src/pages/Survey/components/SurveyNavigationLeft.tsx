import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigationStore } from '@/store/navigationStore';

import MenuBlackIcon from '@/assets/icon/24/menu.black.svg?react';
import QuestionBlackIcon from '@/assets/icon/24/help.fiiled.black.svg?react';
import HomeBlackIcon from '@/assets/icon/24/home.filled.black.svg?react';
import HomeBlueIcon from '@/assets/icon/24/home.filled.blue.svg?react';
import LogoutBlackIcon from '@/assets/icon/24/logout.outline.black.svg?react';
import logoBlack from '@/assets/logoBlack.png';
import SurveyNavigationLeftMenu from '@/pages/Survey/components/SurveyNavigationLeftMenu';

const SurveyNavigationLeft = () => {
  const navigate = useNavigate();
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
    <div className="relative z-10 w-16 h-auto py-0 bg-grayscale-3 shadow-nav-left">
      {/* 사용자 정보 */}
      <div className="flex items-end p-5">
        <span className="whitespace-nowrap">
          <span className="font-medium cursor-pointer text-body1">
            <MenuBlackIcon width={24} height={24} />
          </span>
        </span>
      </div>
      <hr className="border-t border-grayscale-10" />

      {/* 메뉴 렌더링 */}
      {menuItems.map((menu) => (
        <SurveyNavigationLeftMenu
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

export default SurveyNavigationLeft;
