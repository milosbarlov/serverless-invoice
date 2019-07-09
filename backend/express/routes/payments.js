const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();

const paymentsController = require('../controllers/payments');
const paymentController = require('../controllers/payment');

router.get('/', paymentsController.getPayments);

router.post(
  '/',
  [
    body('amount').isLength({ max: 8 }),
    body('currency').isLength({ min: 3, max: 3 }),
  ],
  paymentsController.addPayment
);

router.get('/:id', paymentController.getPayment);

router.put('/:id', paymentController.updatePayment);

router.post('/:id/refund', paymentController.refundPayment);

module.exports = router;
