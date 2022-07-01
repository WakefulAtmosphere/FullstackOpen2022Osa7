import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import loginService from '../services/login';
import { createNotification } from './notificationReducer';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    login(state, action) {
      return action.payload;
    },
    logout() {
      return null;
    },
  },
});

export const {
  login,
  logout,
} = userSlice.actions;

export const useLogout = () => async (dispatch) => {
  const loggedUser = window.localStorage.getItem('loggedUser');
  if (loggedUser) {
    window.localStorage.removeItem('loggedUser');
  }
  blogService.setToken(null);
  dispatch(logout());
};

export const useLogin = (username, password) => async (dispatch) => {
  try {
    const loggedUser = await loginService.login({
      username, password,
    });
    window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
    blogService.setToken(loggedUser.token);
    dispatch(login(loggedUser));
    dispatch(createNotification('successfully logged in', 5));
  } catch (exception) {
    dispatch(createNotification('wrong credentials', 5));
    setTimeout(() => {
      dispatch(createNotification('', 5));
    }, 5000);
  }
};

export const setUser = (user) => async (dispatch) => {
  dispatch(login(user));
};

export default userSlice.reducer;
