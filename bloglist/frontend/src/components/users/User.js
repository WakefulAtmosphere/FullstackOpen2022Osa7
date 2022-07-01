import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const User = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.users);
  const user = users.filter((u) => u.id === id)[0];
  if (!user) return <p>loading user...</p>;
  console.log(user);
  return (
    <div>
      <h1>{user.username}</h1>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
