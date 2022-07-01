require('dotenv').config();

const {
  PORT,
  TEST_MONGODB_URI,
  MONGODB_URI,
  NODE_ENV,
  SECRET,
} = process.env;

const URI = NODE_ENV === 'test'
  ? TEST_MONGODB_URI
  : MONGODB_URI;

module.exports = {
  MONGODB_URI: URI,
  PORT,
  TOKEN_SEED: SECRET,
  NODE_ENV,
};
