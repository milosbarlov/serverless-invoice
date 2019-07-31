const mongoose = require('mongoose');
const chalk = require('chalk');

const success = chalk.green;

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log(success('Mongoose connection succeeded.')))
  .catch(error => console.error(error));

module.exports = mongoose;
