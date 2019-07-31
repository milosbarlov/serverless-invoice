const stripe = require('stripe')(process.env.SK_TEST);
const chalk = require('chalk');

const success = chalk.green;

exports.getPayment = async (req, res, next) => {
  console.log('Getting payment...');

  try {
    const charge = await stripe.charges.retrieve(req.params.id);

    console.log(success('Fetched payment.'));
    res.status(200).json(charge);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePayment = async (req, res, next) => {
  console.log('Updating payment...');

  try {
    const charge = await stripe.charges.update(req.params.id, req.body);

    console.log(success('Updated payment.'));
    res.status(200).json(charge);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.refundPayment = async (req, res, next) => {
  console.log('Refunding payment...');

  const params = req.body;

  params.charge = req.params.id;

  try {
    const refund = await stripe.refunds.create(params);

    console.log(success('Refunded payment.'));
    res.status(201).json(refund);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
