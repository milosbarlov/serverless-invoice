const stripe = require('stripe')(process.env.SK_TEST);
const { validationResult } = require('express-validator');
const chalk = require('chalk');

const success = chalk.green;

exports.updateCard = async (req, res, next) => {
  console.log('Updating card...');

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error(errors.array());
    const error = new Error('Invalid input.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const card = await stripe.customers.updateSource(
      req.params.id,
      req.params.card,
      req.body
    );

    console.log(success('Updated card.'));
    res.status(200).json(card);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteCard = async (req, res, next) => {
  console.log('Deleting card...');

  try {
    const card = await stripe.customers.deleteSource(
      req.params.id,
      req.params.card
    );

    console.log(success('Deleted card.'));
    res.status(200).json(card);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
