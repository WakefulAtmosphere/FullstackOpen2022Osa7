const blogsRouter = require('express').Router();
require('express-async-errors');
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.delete('/:id', async (request, response) => {
  const deletedId = request.params.id;
  const { user } = request;
  if (!user) {
    throw { name: 'JsonWebTokenError' };
  }
  const blogToDelete = await Blog.findById(deletedId);
  if (!blogToDelete) {
    throw { name: 'CastError' };
  }
  if (user.id.toString() !== blogToDelete.user.toString()) {
    throw { name: 'JsonWebTokenError' };
  }
  await Blog.findByIdAndDelete(deletedId);
  user.blogs = user.blogs.filter((blog) => blog._id !== deletedId);
  await User.findByIdAndUpdate(user._id, { blogs: user.blogs }, { runValidators: true, new: true });

  return response.status(204).end();
});

blogsRouter.post('/', async (request, response) => {
  const {
    title,
    author,
    url,
    likes,
  } = request.body;

  const { user } = request;
  if (!user) {
    throw { name: 'JsonWebTokenError' };
  }
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await User.findByIdAndUpdate(user._id, { blogs: user.blogs }, { runValidators: true, new: true });
  response.status(201).json(savedBlog);
  return false;
});

blogsRouter.put('/:id', async (request, response) => {
  const changedId = request.params.id;
  const { body } = request;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updated = await Blog.findByIdAndUpdate(changedId, blog, { runValidators: true, new: true, context: 'query' });
  if (updated) {
    response.json(updated);
  } else {
    throw { name: 'CastError' };
  }
});

module.exports = blogsRouter;
