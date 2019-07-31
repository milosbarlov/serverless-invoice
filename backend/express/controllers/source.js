const stripe = require('stripe')(process.env.SK_TEST);
const { validationResult } = require('express-validator');
const chalk = require('chalk');

const success = chalk.green;

exports.createSource = async (req, res, next) => {
  if (req.body.object === 'bank_account') {
    console.log('Adding bank account...');
  } else {
    console.log('Creating source...');
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Invalid input.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const source = await stripe.customers.createSource(req.params.id, {
      source: req.body.token ? req.body.token : req.body,
    });

    console.log(success('Created source.'));
    res.status(201).json(source);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.verifySource = async (req, res, next) => {
  console.log('Verifying source...');

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error(error.array());
    const error = new Error('Invalid input.');
    error.statusCode = 422;
    throw error;
  }

  const data = [req.body.deposits.first, req.body.deposits.second];

  try {
    const source = await stripe.customers.verifySource(
      req.params.id,
      req.params.bank,
      { amounts: data }
    );

    console.log(success('Verified source.'));
    res.status(200).json(source);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteSource = async (req, res, next) => {
  console.log('Deleting source...');

  try {
    const source = await stripe.customers.deleteSource(
      req.params.id,
      req.params.bank
    );

    console.log(success('Deleted source.'));
    res.status(200).json(source);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
