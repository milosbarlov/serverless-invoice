const stripe = require('stripe')(process.env.SK_TEST);
const { validationResult } = require('express-validator');
const chalk = require('chalk');

const success = chalk.green;

exports.getPayments = async (req, res, next) => {
  console.log('Getting payments...');

  const {
    page,
    pageNum = +page,
    rowsPerPage,
    rowsPerPageNum = +rowsPerPage,
  } = req.query;
  const { sortBy, filter, startDate, endDate } = req.query;
  const descending = req.query.descending === 'true';
  const status = req.query.status ? req.query.status : [];
  const data = { payments: [] };

  try {
    let start;
    let end;

    if (startDate) {
      start = new Date(startDate);
      start = Math.floor(start.getTime() / 1000);
    }

    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      end = Math.floor(end.getTime() / 1000);
    }

    await stripe.charges
      .list({
        limit: 100,
        created: {
          gte: start,
          lte: end,
        },
      })
      .autoPagingEach(async payment => {
        data.payments.push({
          amount: payment.amount,
          amountRefunded: payment.amount_refunded,
          created: payment.created,
          currency: payment.currency,
          description: payment.description,
          id: payment.id,
          receipt_email: payment.receipt_email,
          refunded: payment.refunded,
          status: payment.status,
        });
      });

    console.log('Found payments...');

    if (status.length > 0) {
      data.payments = data.payments.filter(
        payment =>
          (status.includes(payment.status) && !payment.refunded) ||
          (status.includes('refunded') && payment.refunded)
      );
    }

    if (filter) {
      data.payments = data.payments.filter(payment => {
        const keys = ['description', 'id', 'receipt_email'];

        return keys.some(key => payment[key].includes(filter.toLowerCase()));
      });
    }

    data.rowsNumber = data.payments.length;

    const des = descending ? -1 : 1;

    if (sortBy) {
      if (sortBy === 'created') {
        data.payments.sort((a, b) => (a[sortBy] - b[sortBy]) * des);
      } else {
        data.payments.sort((a, b) => {
          const x = a[sortBy].toLowerCase();
          const y = b[sortBy].toLowerCase();
          if (x < y) {
            return -1 * des;
          }
          if (x > y) {
            return 1 * des;
          }
          return 0;
        });
      }
    }

    if (rowsPerPageNum) {
      data.payments = data.payments.slice(
        (pageNum - 1) * rowsPerPageNum,
        pageNum * rowsPerPageNum
      );
    }

    console.log(success('Fetched payments.'));
    res.status(200).json(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addPayment = async (req, res, next) => {
  console.log('Adding payment...');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error(errors.array());
    const error = new Error('Invalid input.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const charge = await stripe.charges.create(req.body);

    console.log(success('Added payment.'));
    res.status(201).json(charge);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
