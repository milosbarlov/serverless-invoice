const { mongoose } = require('./db/mongoose');
const serverless = require('serverless-http');
const app = require('./app');

module.exports.handler = serverless(app);
