const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();

const customersController = require('../controllers/customers');
const customerController = require('../controllers/customer');
const cardController = require('../controllers/card');
const sourceController = require('../controllers/source');

router.get('/', customersController.getCustomers);

router.post(
  '/',
  [
    body('email').isEmail(),
    body('shipping.address.line1')
      .withMessage('Must include an address for line 1.')
      .isLength({ min: 1 })
      .trim(),
  ],
  customersController.addCustomer
);

router.get('/:id', customerController.getCustomer);

router.put(
  '/:id',
  [
    body('email').isEmail(),
    body('shipping.address.line1')
      .withMessage('Must include an address for line 1.')
      .isLength({ min: 1 })
      .trim(),
  ],
  customerController.updateCustomer
);

router.delete('/:id', customerController.deleteCustomer);

router.put('/:id/cards/:card', cardController.updateCard);

router.delete('/:id/cards/:card', cardController.deleteCard);

router.post('/:id/source', sourceController.createSource);

router.delete('/:id/bankaccount/:bank', sourceController.deleteSource);

router.post('/:id/bankaccount/:bank/verify', sourceController.verifySource);

module.exports = router;
