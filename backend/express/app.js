const express = require('express');
const cors = require('cors');
const { mongoose } = require('./db/mongoose');

const customersRouter = require('./routes/customers');
const paymentsRouter = require('./routes/payments');
const invoicesRouter = require('./routes/invoices');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/customers', customersRouter);
app.use('/payments', paymentsRouter);
app.use('/invoices', invoicesRouter);

// Express error handler middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message } = error;
  res.status(status).json({ message });
});

module.exports = app;
