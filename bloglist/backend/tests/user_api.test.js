// const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekretest', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const initialUsers = await User.find({});

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'msalai',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const finalUsers = await User.find({});
    expect(finalUsers).toHaveLength(initialUsers.length + 1);

    const usernames = finalUsers.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('...but fails with a stale username', async () => {
    const newUser = {
      username: 'root',
      password: 'correcthorsebatterystaple',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('...and fails with no username', async () => {
    const newUser = {
      name: 'root',
      password: 'correcthorsebatterystaple',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('...and yet more fails with no password', async () => {
    const newUser = {
      username: 'notRoot',
      name: 'root',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('...and fails with a short password', async () => {
    const newUser = {
      username: 'notRoot',
      name: 'root',
      password: 'co',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('...and similarly fails with a short username', async () => {
    const newUser = {
      username: 'ro',
      name: 'root',
      password: 'correcthorsebatterystaple',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });
});
