// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  endpoint: process.env.NODE_APP_API_URL,
  masterKey: process.env.NODE_APP_API_KEY,
  port: process.env.PORT
};