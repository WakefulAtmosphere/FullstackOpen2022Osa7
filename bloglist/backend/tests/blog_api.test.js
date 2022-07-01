const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

const fakeRoot = { username: 'root', password: '1234' };

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
];
describe('When blogs exist', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    const response = await api.post('/api/users')
      .send(fakeRoot);
    const firstBlog = new Blog({ ...initialBlogs[0], user: response.body.id });
    const secondBlog = new Blog({ ...initialBlogs[1], user: response.body.id });
    await firstBlog.save();
    await secondBlog.save();
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('correct amount of blogs is returned', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const response = await api.get('/api/blogs');
    const content = response.body;
    expect(content).toHaveLength(2);
  });

  test('blogs are identified by id', async () => {
    const response = await api.get('/api/blogs');
    const content = response.body[0];
    expect(content.id).toBeDefined();
  });

  test('a blog can be posted', async () => {
    const blogResponse = await api.get('/api/blogs');
    const blogList = blogResponse.body;
    const loginResponse = await api.post('/api/login')
      .send(fakeRoot);
    let { token } = loginResponse._body;
    token = `Bearer ${token}`;
    await api
      .post('/api/blogs')
      .set({ Authorization: token })
      .send(initialBlogs[2])
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const newResponse = await Blog.find({});
    expect(newResponse).toHaveLength(blogList.length + 1);
  });

  test('a blog with undefined like count has 0 likes by default', async () => {
    const mockBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    };
    const loginResponse = await api.post('/api/login')
      .send(fakeRoot);
    let { token } = loginResponse._body;
    token = `Bearer ${token}`;
    await api
      .post('/api/blogs')
      .send(mockBlog)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const response = await Blog.find({});
    expect(response[response.length - 1].likes).toBe(0);
  });

  test('a blog with undefined title produces an error', async () => {
    const mockBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    };
    const loginResponse = await api.post('/api/login')
      .send(fakeRoot);
    let { token } = loginResponse._body;
    token = `Bearer ${token}`;
    await api
      .post('/api/blogs')
      .send(mockBlog)
      .set({ Authorization: token })
      .expect(400);
  });

  test('a blog with undefined url produces an error', async () => {
    const mockBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
    };
    const loginResponse = await api.post('/api/login')
      .send(fakeRoot);
    let { token } = loginResponse._body;
    token = `Bearer ${token}`;
    await api
      .post('/api/blogs')
      .send(mockBlog)
      .set({ Authorization: token })
      .expect(400);
  });

  test('a blog can be deleted', async () => {
    const blogsBefore = await Blog.find({});
    const deletedId = blogsBefore[0].id;
    const loginResponse = await api.post('/api/login')
      .send(fakeRoot);
    let { token } = loginResponse._body;
    token = `Bearer ${token}`;
    await api
      .delete(`/api/blogs/${deletedId}`)
      .set({ Authorization: token })
      .expect(204);
    const blogsAfter = await Blog.find({});
    expect(blogsAfter.length).toBe(blogsBefore.length - 1);
  });

  test('...but cannot be deleted twice', async () => {
    const blogsBefore = await Blog.find({});
    const deletedId = blogsBefore[0].id;
    const loginResponse = await api.post('/api/login')
      .send(fakeRoot);
    let { token } = loginResponse._body;
    token = `Bearer ${token}`;
    await api
      .delete(`/api/blogs/${deletedId}`)
      .set({ Authorization: token });
    const blogsInTheMiddle = await Blog.find({});
    await api
      .delete(`/api/blogs/${deletedId}`)
      .set({ Authorization: token })
      .expect(400);
    const blogsAfter = await Blog.find({});
    expect(blogsAfter.length).toBe(blogsInTheMiddle.length);
  });

  test('objects can be changed', async () => {
    const blogsBefore = await Blog.find({});
    const changedId = blogsBefore[0].id;
    const newBlog = {
      likes: 15,
    };
    await api
      .put(`/api/blogs/${changedId}`)
      .send(newBlog);
    const blogAfter = await Blog.findById(changedId);
    expect(blogAfter.likes).toBe(15);
    expect(blogAfter.author).toBe(blogsBefore[0].author);
  });

  test('...and again', async () => {
    const blogsBefore = await Blog.find({});
    const changedId = blogsBefore[0].id;
    const newBlog = {
      likes: 20,
    };
    await api
      .put(`/api/blogs/${changedId}`)
      .send(newBlog);
    const blogAfter = await Blog.findById(changedId);
    expect(blogAfter.likes).toBe(20);
  });

  test('...and a proper error is received for wrong ids', async () => {
    const blogsBefore = await Blog.find({});
    const changedId = blogsBefore[0].id;
    const newBlog = {
      author: blogsBefore[0].author,
      title: blogsBefore[0].title,
      url: blogsBefore[0].url,
      likes: 20,
    };
    const loginResponse = await api.post('/api/login')
      .send(fakeRoot);
    let { token } = loginResponse._body;
    token = `Bearer ${token}`;
    await api.delete(`/api/blogs/${changedId}`)
      .set({ Authorization: token });
    await api
      .put(`/api/blogs/${changedId}`)
      .send(newBlog)
      .expect(400);
  });
});

describe('When posted via the api', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = fakeRoot;
    await api.post('/api/users')
      .send(user);
    const loginResponse = await api.post('/api/login')
      .send(fakeRoot);
    let { token } = loginResponse._body;
    token = `Bearer ${token}`;
    await Blog.deleteMany({});
    const blog = initialBlogs[0];
    await api.post('/api/blogs')
      .send(blog)
      .set({ Authorization: token });
  });
  test('...blogs have an id matching a user', async () => {
    const blogs = await Blog.find({});
    const users = await User.find({});
    expect(blogs[0].user).toEqual(users[0]._id);
  });
  test('... and requested through the api actually contain the user', async () => {
    const userResponse = await api.get('/api/users');
    const blogResponse = await api.get('/api/blogs');
    const blogs = blogResponse._body;
    const user = userResponse._body[0];
    delete user.blogs;
    expect(blogs[0].user).toEqual(user);
  });
  test('...and post requests without a token fail with an appropriate code', async () => {
    await api.post('/api/blogs')
      .send(initialBlogs[1])
      .expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
