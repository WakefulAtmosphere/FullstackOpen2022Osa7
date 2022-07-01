import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationReducer';
import blogReducer from './blogReducer';
import userSessionReducer from './userSessionReducer';
import userReducer from './userReducer';

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    blogs: blogReducer,
    currentUser: userSessionReducer,
    users: userReducer,
  },
});

export default store;
