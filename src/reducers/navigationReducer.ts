import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

// Define a type for the slice state
interface NavigationState {
  isOpenRightNavigation: boolean;
}

// Define the initial state using that type
const initialState: NavigationState = {
  isOpenRightNavigation: false,
};

export const NavigationSlice = createSlice({
  name: 'navigationChanger',
  initialState,
  reducers: {
    toggleRightNavigation: (state) => {
      state.isOpenRightNavigation = !state.isOpenRightNavigation;
    },
  },
});

export const { toggleRightNavigation } = NavigationSlice.actions;

export const selectIsOpen = (state: RootState) =>
  state.navigation.isOpenRightNavigation;

export default NavigationSlice.reducer;
