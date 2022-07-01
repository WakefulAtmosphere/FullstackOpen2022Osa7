const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { TOKEN_SEED } = require('./config');

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid or missing token',
    });
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }
  next(error);
  return false;
};

const tokenExtractor = (request) => {
  const authorization = request.get('authorization');
  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    return null;
  }
  const token = authorization.substring(7);
  request.token = token;
  return false;
};

const userExtractor = async (request, response, next) => {
  tokenExtractor(request);
  try {
    const decodedToken = jwt.verify(request.token, TOKEN_SEED);
    request.user = await User.findById(decodedToken.id);
    next();
    return false;
  } catch {
    next();
    return false;
  }
};

module.exports = {
  errorHandler,
  userExtractor,
};
