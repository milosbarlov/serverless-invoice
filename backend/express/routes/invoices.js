const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const invoicesController = require('../controllers/invoices');
const auth = require('../middleware/auth');

router.get('/', auth, invoicesController.getInvoices);

router.post(
  '/',
  auth,
  [
    body('amount_paid')
      .isInt()
      .optional(),
    body('customer.email')
      .isEmail()
      .optional(),
    body('customer.id').exists(),
    body('discount').isInt(),
    body('invoice_prefix')
      .exists()
      .isLength({ min: 3, max: 12 })
      .isAlphanumeric()
      .isUppercase()
      .trim(),
    body('shipping').isInt(),
    body('subtotal').isInt(),
    body('total').isInt(),
  ],
  invoicesController.addInvoice
);

router.get('/:id', auth, invoicesController.getInvoice);

router.put(
  '/:id',
  auth,
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

router.delete('/:id', auth, invoicesController.deleteInvoice);

module.exports = router;
