import { create } from 'zustand';
interface ConsultTabState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const useConsultTabStore = create<ConsultTabState>((set) => ({
  activeTab: 'pastConsult',
  setActiveTab: (tab: string) => set({ activeTab: tab }),
}));

export default useConsultTabStore;
