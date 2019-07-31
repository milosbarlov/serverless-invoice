const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const paymentsController = require('../controllers/payments');
const paymentController = require('../controllers/payment');

router.get('/', paymentsController.getPayments);

router.post(
  '/',
  [
    body('amount')
      .isLength({ max: 8 })
      .isInt()
      .exists(),
    body('currency').exists(),
    body('receipt_email')
      .isEmail()
      .optional(),
  ],
  paymentsController.addPayment
);

router.get('/:id', paymentController.getPayment);

router.put('/:id', paymentController.updatePayment);

router.post('/:id/refund', paymentController.refundPayment);

module.exports = router;
