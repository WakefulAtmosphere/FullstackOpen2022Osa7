import axios from 'axios';

const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const submitBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, blog, config);
  return response;
};

const like = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  const url = `${baseUrl}/${blog.id}`;
  const sentBlog = { ...blog };
  sentBlog.likes += 1;
  await axios.put(url, sentBlog, config);
};

const deleteBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  const url = `${baseUrl}/${blog.id}`;
  await axios.delete(url, config);
};

const exports = {
  getAll,
  setToken,
  submitBlog,
  like,
  deleteBlog,
};

export default exports;
