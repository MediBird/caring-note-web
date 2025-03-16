import { create } from 'zustand';

interface RightNavigationState {
  isOpen: boolean;
  toggleRightNav: () => void;
  openRightNav: () => void;
  closeRightNav: () => void;
}

const useRightNavigationStore = create<RightNavigationState>((set) => ({
  isOpen: false,
  toggleRightNav: () => set((state) => ({ isOpen: !state.isOpen })),
  openRightNav: () => set({ isOpen: true }),
  closeRightNav: () => set({ isOpen: false }),
}));

export default useRightNavigationStore;
