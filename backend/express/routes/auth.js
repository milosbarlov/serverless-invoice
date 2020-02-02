const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email!'),
    body('username')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Username is empty!')
      .custom(async value => {
        const user = await User.findOne({ username: value });

        if (user) {
          return Promise.reject();
        }
      })
      .withMessage('Username already exists!'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Must be at least 6 characters long!'),
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
