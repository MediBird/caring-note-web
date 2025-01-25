// Navigation 상태 관리 store
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NavigationState {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

// Zustand store 생성
export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      activeMenu: '홈', // 초기 상태
      setActiveMenu: (menuName: string) => set({ activeMenu: menuName }),
    }),
    {
      name: 'menu-storage', // localStorage에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // localStorage에 저장
    },
  ),
);
