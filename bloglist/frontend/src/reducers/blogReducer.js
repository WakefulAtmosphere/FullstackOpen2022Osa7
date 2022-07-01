/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import { createNotification } from './notificationReducer';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    like(state, action) {
      state[state.findIndex((blog) => blog.id === action.payload)].likes += 1;
      return state;
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
    newBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const {
  like,
  newBlog,
  setBlogs,
  deleteBlog,
} = blogSlice.actions;

export const initializeStore = () => async (dispatch) => {
  const blogs = await blogService.getAll();
  dispatch(setBlogs(blogs));
};

export const addBlog = (content, user) => async (dispatch) => {
  const blog = { ...content, likes: 0, user: user.id };
  const addedBlog = await blogService.submitBlog(blog);
  addedBlog.data.user = user;
  dispatch(newBlog({ ...addedBlog.data }));
  dispatch(createNotification(`submitted blog ${blog.title}`, 5));
};

export const likeBlog = (blog) => async (dispatch) => {
  await blogService.like(blog);
  dispatch(like(blog.id));
  dispatch(createNotification(`liked blog ${blog.title}`, 5));
};

export const removeBlog = (blog) => async (dispatch) => {
  await blogService.deleteBlog(blog);
  dispatch(deleteBlog(blog.id));
  dispatch(createNotification(`deleted blog ${blog.title}`, 5));
};

export default blogSlice.reducer;
