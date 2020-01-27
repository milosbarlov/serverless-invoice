const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const chalk = require('chalk');

const success = chalk.green;

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  console.log('Creating user...');
  const { email, username, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error(errors.array());
    const error = new Error('Invalid input.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    const hashed = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      username,
      password: hashed,
    });

    const result = await user.save();

    console.log(success('Created user account.'));
    res
      .status(201)
      .json({ message: 'Created user account.', userId: result._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  console.log('verifying user...');
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      const error = new Error('Invalid username or password!');
      error.statusCode = 401;
      throw error;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      const error = new Error('Invalid username or password!');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        username: user.username,
        userId: user._id.toString(),
      },
      process.env.SECRET,
      { expiresIn: '1h' }
    );

    console.log(success(`${username} logged in.`));

    res
      .status(200)
      .json({ token, userId: user._id.toString(), expiresIn: 3600000 });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
