import { create } from 'zustand';

interface ConsultTabStore {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const useConsultTabStore = create<ConsultTabStore>((set) => ({
  selectedTab: 'pastConsult',
  setSelectedTab: (tab) => set({ selectedTab: tab }),
}));
