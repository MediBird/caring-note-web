import { create } from 'zustand';

export enum ConsultTab {
  pastConsult = 'pastConsult',
  consultCard = 'survey',
  medicineMemo = 'medicine',
  consultNote = 'note',
  discardMedicineNote = 'wasteMedication',
}

interface ConsultTabState {
  activeTab: ConsultTab;
  setActiveTab: (tab: ConsultTab) => void;
}

const useConsultTabStore = create<ConsultTabState>((set) => ({
  activeTab: ConsultTab.pastConsult,
  setActiveTab: (tab: ConsultTab) => set({ activeTab: tab }),
}));

export default useConsultTabStore;
