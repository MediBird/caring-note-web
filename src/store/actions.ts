import { GetCounselorRes } from '@/api/api';
import { Action } from '@reduxjs/toolkit';

export const SET_USER_INFO = 'SET_USER_INFO';

export interface SetUserInfoAction extends Action {
  type: typeof SET_USER_INFO;
  payload: GetCounselorRes;
}

export const setUserInfo = (userInfo: GetCounselorRes): SetUserInfoAction => ({
  type: SET_USER_INFO,
  payload: userInfo,
});
