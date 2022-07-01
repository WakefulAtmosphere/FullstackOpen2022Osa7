import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
  },
});

let notificationTimeouts = [];

const { setNotification } = notificationSlice.actions;

export const createNotification = (content, timeout) => async (dispatch) => {
  dispatch(setNotification(content));
  for (let i = 0; i < notificationTimeouts.length; i += 1) {
    clearTimeout(notificationTimeouts[i]);
  }
  notificationTimeouts = [];
  notificationTimeouts.push(setTimeout(() => (dispatch(setNotification(''))), timeout * 1000));
};
export default notificationSlice.reducer;
