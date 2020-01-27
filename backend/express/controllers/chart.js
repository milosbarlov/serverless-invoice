const stripe = require('stripe')(process.env.SK_TEST);
const chalk = require('chalk');

const success = chalk.green;

exports.getGrossVolume = async (req, res, next) => {
  console.log('Getting gross volume...');

  const { start_time } = req.query;

  try {
    const transactions = await stripe.balanceTransactions
      .list({ created: { gte: start_time }, type: 'charge' })
      .autoPagingToArray({ limit: 10000 });

    console.log(success('Fetched gross volume.'));
    res.status(200).json({ transactions });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
