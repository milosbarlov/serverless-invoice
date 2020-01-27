const express = require('express');
const cors = require('cors');
const { mongoose } = require('./db/mongoose');

const customersRouter = require('./routes/customers');
const paymentsRouter = require('./routes/payments');
const invoicesRouter = require('./routes/invoices');
const settingsRouter = require('./routes/settings');
const authRouter = require('./routes/auth');
const checkoutRouter = require('./routes/checkout');
const chartRouter = require('./routes/chart');

const app = express();

// Maintenance mode middleware
// app.use((req, res, next) => {
//   res.status(503).send('Website under maintenance!');
// });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/customers', customersRouter);
app.use('/payments', paymentsRouter);
app.use('/invoices', invoicesRouter);
app.use('/settings', settingsRouter);
app.use('/auth', authRouter);
app.use('/checkout', checkoutRouter);
app.use('/chart', chartRouter);

// Express error handler middleware
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ message, data });
});

module.exports = app;
