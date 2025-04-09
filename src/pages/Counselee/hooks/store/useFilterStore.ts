import { create } from 'zustand';

export interface FilterState {
  name: string;
  birthDates: string[];
  affiliatedWelfareInstitutions: string[];
}

interface FilterStore {
  filter: FilterState;
  setFilter: (filter: Partial<FilterState>) => void;
  clearFilters: () => void;
}

const initialState: FilterState = {
  name: '',
  birthDates: [],
  affiliatedWelfareInstitutions: [],
};

export const useFilterStore = create<FilterStore>((set) => ({
  filter: initialState,

  setFilter: (newFilter: Partial<FilterState>) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),

  clearFilters: () => set({ filter: initialState }),
}));

// 선택자 함수들
export const selectNameFilter = (state: FilterStore) => state.filter.name;
export const selectBirthDates = (state: FilterStore) => state.filter.birthDates;
export const selectAffiliatedInstitutions = (state: FilterStore) =>
  state.filter.affiliatedWelfareInstitutions;
