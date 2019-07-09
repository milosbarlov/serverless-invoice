const stripe = require('stripe')(process.env.SK_TEST);
const { validationResult } = require('express-validator/check');

exports.createSource = async (req, res, next) => {
  console.log('Creating source...');

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

    console.log('Created source.');
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
    const error = new Error('Invalid input.');
    error.statusCode = 422;
    throw error;
  }

  const data = [
    parseInt(req.body.deposits.first, 10),
    parseInt(req.body.deposits.second, 10),
  ];

  try {
    const source = await stripe.customers.verifySource(
      req.params.id,
      req.params.bank,
      { amounts: data }
    );

    console.log('Verified source.');
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

    console.log('Deleted source.');
    res.status(200).json(source);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
