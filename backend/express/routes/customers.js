const express = require('express');
const { body, oneOf } = require('express-validator');

const router = express.Router();

const customersController = require('../controllers/customers');
const customerController = require('../controllers/customer');
const cardController = require('../controllers/card');
const sourceController = require('../controllers/source');
const auth = require('../middleware/auth');

router.get('/', auth, customersController.getCustomers);

router.post(
  '/',
  auth,
  [
    body('email')
      .isEmail()
      .optional(),
    body('shipping.address.line1')
      .if(
        oneOf(
          body('shipping.address.line2')
            .not()
            .isEmpty()
            .trim()
            .optional(),
          body('shippping.address.city')
            .not()
            .isEmpty()
            .trim()
            .optional(),
          body('shipping.address.state')
            .not()
            .isEmpty()
            .trim()
            .optional(),
          body('shipping.address.postal_code')
            .not()
            .isEmpty()
            .trim()
            .optional()
        )
      )
      .not()
      .isEmpty()
      .trim()
      .optional()
      .withMessage('Address line 1 is required.'),
  ],
  customersController.addCustomer
);

router.get('/:id', auth, customerController.getCustomer);

router.put(
  '/:id',
  auth,
  [
    body('email')
      .isEmail()
      .optional(),
    body('shipping.address.line1')
      .if(
        oneOf(
          body('shipping.address.line2')
            .not()
            .isEmpty()
            .trim()
            .optional(),
          body('shippping.address.city')
            .not()
            .isEmpty()
            .trim()
            .optional(),
          body('shipping.address.state')
            .not()
            .isEmpty()
            .trim()
            .optional(),
          body('shipping.address.postal_code')
            .not()
            .isEmpty()
            .trim()
            .optional()
        )
      )
      .not()
      .isEmpty()
      .trim()
      .optional()
      .withMessage('Address line 1 is required.'),
  ],
  customerController.updateCustomer
);

router.delete('/:id', auth, customerController.deleteCustomer);

router.put(
  '/:id/cards/:card',
  auth,
  [
    body('exp_month')
      .isInt({ min: 1, max: 12, allow_leading_zeroes: true })
      .optional(),
    body('exp_year')
      .isInt()
      .isLength({ min: 4, max: 4 })
      .optional(),
  ],
  cardController.updateCard
);

router.delete('/:id/cards/:card', auth, cardController.deleteCard);

router.post(
  '/:id/source',
  auth,
  oneOf([
    [
      body('object').exists(),
      body('country')
        .exists()
        .isISO31661Alpha2(),
      body('currency').exists(),
      body('account_holder_name').exists(),
      body('account_holder_type').exists(),
      body('account_number').exists(),
    ],
    body('token').exists(),
  ]),
  sourceController.createSource
);

router.delete('/:id/bankaccount/:bank', auth, sourceController.deleteSource);

router.post(
  '/:id/bankaccount/:bank/verify',
  auth,
  [
    body('deposits.first').isInt({
      min: 1,
      max: 99,
      allow_leading_zeroes: true,
    }),
    body('deposits.second').isInt({
      min: 1,
      max: 99,
      allow_leading_zeroes: true,
    }),
  ],
  sourceController.verifySource
);

module.exports = router;
