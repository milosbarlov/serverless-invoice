const express = require('express');

const invoiceController = require('../controllers/invoices');
const paymentsController = require('../controllers/payments');

const router = express.Router();

router.get('/:id', invoiceController.getInvoice);

router.post('/:id/pay', invoiceController.payInvoice);

router.post('/payments', paymentsController.addPayment);

module.exports = router;
