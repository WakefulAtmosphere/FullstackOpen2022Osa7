import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLogout } from '../reducers/userSessionReducer';

const Navigation = () => {
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(useLogout());
  };

  return (
    <div>
      {user && (
        <div>
          <h2>blogs</h2>
          <p>{user && `logged in as ${user.username}`}</p>
          <button onClick={handleLogout} type="button">log out</button>
        </div>
      )}

    </div>
  );
};

export default Navigation;
