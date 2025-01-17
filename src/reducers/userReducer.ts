import { GetCounselorRes } from '@/api/api';
import { SetUserInfoAction } from '@/store/actions';

interface UserState {
  userInfo: GetCounselorRes | null;
}
const initialState: UserState = {
  userInfo: null,
};

const userReducer = (state = initialState, action: SetUserInfoAction) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
