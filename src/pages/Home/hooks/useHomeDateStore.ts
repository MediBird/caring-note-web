import { addMonths, startOfToday } from 'date-fns';
import { create } from 'zustand';

export interface HomeDateState {
  selectedDate: Date;
  selectedMonth: Date;
}

export interface HomeDateActions {
  setSelectedDate: (date: Date) => void;
  setSelectedMonth: (month: Date) => void;
}

export type HomeDateStore = HomeDateState & HomeDateActions;

const today = startOfToday();
const thisMonth = addMonths(today, 0);

export const useHomeDateStore = create<HomeDateStore>((set) => ({
  selectedDate: today,
  selectedMonth: thisMonth,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
}));
