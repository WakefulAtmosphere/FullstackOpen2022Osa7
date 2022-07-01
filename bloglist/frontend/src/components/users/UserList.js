import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const users = useSelector((state) => state.users);
  const sortingFunction = (a, b) => {
    if (a.blogs.length < b.blogs.length) {
      return 1;
    }
    if (a.blogs.length > b.blogs.length) {
      return -1;
    }
    return 0;
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td />
            <td><b>blogs created</b></td>
          </tr>
        </thead>
        <tbody>
          {[...users].sort(sortingFunction).map((user) => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogList;
