const chalk = require('chalk');
const User = require('../models/user');

const success = chalk.green;

exports.getSettings = async (req, res, next) => {
  console.log('Getting settings...');
  const { userId } = req;

  try {
    const { business_profile } = await User.findOne({ _id: userId });

    console.log(success('Fetched settings.'));
    res.status(200).json(business_profile);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  console.log('Updating settings...');

  const update = req.body;
  const options = { new: true, upsert: true, setDefaultsOnInsert: true };

  try {
    const setting = await User.findOneAndUpdate(
      { _id: req.userId },
      {},
      options
    ).set({ business_profile: update });

    console.log(success('Updated settings.'));
    res.status(200).json(setting);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
