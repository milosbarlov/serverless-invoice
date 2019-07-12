const mongoose = require('mongoose');

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Mongoose connection succeeded.'))
  .catch(error => console.error(error));

module.exports = mongoose;
