const express = require('express');

const router = express.Router();

const invoicesController = require('../controllers/invoices');

router.get('/', invoicesController.getInvoices);

router.post('/', invoicesController.addInvoice);

router.get('/:id', invoicesController.getInvoice);

router.put('/:id', invoicesController.updateInvoice);

router.delete('/:id', invoicesController.deleteInvoice);

module.exports = router;
