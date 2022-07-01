const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const testingRouter = require('./controllers/testing');
const logger = require('./utils/logger');
const { errorHandler, userExtractor } = require('./utils/middleware');

const app = express();

const mongoUrl = config.MONGODB_URI;
logger.info('connecting to', mongoUrl);

mongoose.connect(mongoUrl)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
if (config.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}
app.use(errorHandler);

module.exports = app;
