import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Blog from './Blog';
import BlogForm from './BlogForm';
import Togglable from '../Togglable';
import {
  addBlog,
  removeBlog,
  likeBlog,
} from '../../reducers/blogReducer';

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const sortingFunction = (a, b) => {
    if (a.likes < b.likes) {
      return 1;
    }
    if (a.likes > b.likes) {
      return -1;
    }
    return 0;
  };
  const addLike = (blog) => {
    dispatch(likeBlog(blog));
  };
  const submitBlog = (blog) => {
    dispatch(addBlog(blog, user));
  };
  const deleteBlog = (blog) => {
    dispatch(removeBlog(blog));
  };

  return (
    <div>
      <Togglable buttonLabel="add new blog">
        <BlogForm submitBlog={submitBlog} />
      </Togglable>
      {[...blogs].sort(sortingFunction).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          addLike={addLike}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default BlogList;
