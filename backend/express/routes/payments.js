const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const paymentsController = require('../controllers/payments');
const paymentController = require('../controllers/payment');
const auth = require('../middleware/auth');

router.get('/', auth, paymentsController.getPayments);

router.post(
  '/',
  auth,
  [
    body('amount')
      .isLength({ max: 8 })
      .toInt()
      .exists(),
    body('currency').exists(),
    body('receipt_email')
      .isEmail()
      .optional(),
  ],
  paymentsController.addPayment
);

router.get('/:id', auth, paymentController.getPayment);

router.put('/:id', auth, paymentController.updatePayment);

router.post('/:id/refund', auth, paymentController.refundPayment);

module.exports = router;
