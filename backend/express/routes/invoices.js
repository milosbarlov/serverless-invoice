const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const invoicesController = require('../controllers/invoices');

router.get('/', invoicesController.getInvoices);

router.post(
  '/',
  [
    body('amount_due')
      .isInt()
      .optional(),
    body('amount_paid')
      .isInt()
      .optional(),
    body('currency').exists(),
    body('customer.email')
      .isEmail()
      .optional(),
    body('customer.id').exists(),
    body('invoice_prefix')
      .exists()
      .isLength({ min: 3, max: 12 })
      .isAlphanumeric()
      .isUppercase()
      .trim(),
  ],
  invoicesController.addInvoice
);

router.get('/:id', invoicesController.getInvoice);

router.put(
  '/:id',
  [
    body('invoice_prefix')
      .isLength({ min: 3, max: 12 })
      .isAlphanumeric()
      .isUppercase()
      .trim()
      .optional(),
  ],
  invoicesController.updateInvoice
);

router.delete('/:id', invoicesController.deleteInvoice);

module.exports = router;
