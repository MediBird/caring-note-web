import { create } from 'zustand';

interface LeaveOutDialogStore {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  onConfirm: () => void;
  setOnConfirm: (onConfirm: () => void) => void;
}

export const useLeaveOutDialogStore = create<LeaveOutDialogStore>((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
  onConfirm: () => {},
  setOnConfirm: (onConfirm) => set({ onConfirm }),
}));
