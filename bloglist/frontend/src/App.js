import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import {
  Routes, Route,
} from 'react-router-dom';

import { initializeStore } from './reducers/blogReducer';
import { initializeUsers } from './reducers/userReducer';
import { setUser } from './reducers/userSessionReducer';
import blogService from './services/blogs';
import Notification from './components/Notification';
import Home from './components/Home';
import Navigation from './components/Navigation';
import UserList from './components/users/UserList';
import User from './components/users/User';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeStore());
    dispatch(initializeUsers());
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      dispatch(setUser(loggedUser));
      blogService.setToken(loggedUser.token);
    }
  }, []);

  return (
    <div>
      <Navigation />
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </div>
  );
};

export default App;
