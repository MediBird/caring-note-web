import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export enum AssistantInfoTab {
  basicInfo = 'basicInfo',
  healthInfo = 'healthInfo',
  lifeInfo = 'lifeInfo',
  independentInfo = 'independentInfo',
}

interface AssistantInfoTabState {
  activeTab: AssistantInfoTab;
  setActiveTab: (tab: AssistantInfoTab) => void;
}
const useAssistantInfoTabStore = create<AssistantInfoTabState>()(
  persist(
    (set) => ({
      activeTab: AssistantInfoTab.basicInfo,
      setActiveTab: (tab: AssistantInfoTab) => set({ activeTab: tab }),
    }),
    {
      name: 'active-tab-storage', // localStorage key
      storage: createJSONStorage(() => localStorage), // 저장소 설정 (localStorage 사용)
    },
  ),
);

export default useAssistantInfoTabStore;
