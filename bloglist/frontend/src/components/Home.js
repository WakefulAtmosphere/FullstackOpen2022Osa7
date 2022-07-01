import React from 'react';
import { useSelector } from 'react-redux';
import BlogList from './blogs/BlogList';
import LoginForm from './LoginForm';

const Home = () => {
  const user = useSelector((state) => state.currentUser);
  return (
    <div>
      {
    user === null ? <LoginForm />
      : (
        <BlogList />
      )
  }
    </div>
  );
};

export default Home;
