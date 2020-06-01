const stripe = require('stripe')(process.env.SK_TEST);
const { validationResult } = require('express-validator');
const chalk = require('chalk');

const success = chalk.green;

exports.getCustomer = async (req, res, next) => {
  console.log('Getting customer...');

  const data = { info: {}, charges: { data: [] } };

  try {
    const customer = await stripe.customers.retrieve(req.params.id);
    console.log('Found customer...');

    data.info = customer;

    const charges = await stripe.charges.list({
      customer: req.params.id,
      limit: 100,
    });
    console.log('Found charges...');

    data.charges.data = charges.data;

    console.log(success('Fetched customer.'));
    res.status(200).json(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  console.log('Updating customer...');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error(error.array());
    const error = new Error('Invalid input.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const customer = await stripe.customers.update(req.params.id, req.body);

    console.log(success('Updated customer.'));
    res.status(200).json(customer);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  console.log('Deleting customer...');
  try {
    const confirmation = await stripe.customers.del(req.params.id);

    console.log(success('Deleted customer.'));
    res.status(200).json(confirmation);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
