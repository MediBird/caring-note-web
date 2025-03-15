import { create } from 'zustand';

interface RightNavigationState {
  isRightNavOpen: boolean;
  setRightNavIsOpen: (isOpen: boolean) => void;
  toggleRightNav: () => void;
}

const useRightNavigationStore = create<RightNavigationState>((set) => ({
  isRightNavOpen: false,
  setRightNavIsOpen: (isOpen) => set({ isRightNavOpen: isOpen }),
  toggleRightNav: () =>
    set((state) => ({ isRightNavOpen: !state.isRightNavOpen })),
}));

export default useRightNavigationStore;
