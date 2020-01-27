const chalk = require('chalk');
const Invoice = require('../models/invoice');
const { emailInvoice, emailReceipt } = require('../services/email');

const success = chalk.green;

exports.getInvoices = async (req, res, next) => {
  console.log('Getting invoices...');

  const {
    page,
    pageNum = +page,
    rowsPerPage,
    rowsPerPageNum = +rowsPerPage,
  } = req.query;
  const { filter, sortBy, status, startDate, endDate } = req.query || null;
  const descending = req.query.descending === 'true';
  const pastDue = req.query.pastDue === 'true';
  const order = descending ? -1 : 1;

  try {
    // Create query instance
    const query = Invoice.find();

    // Filter
    if (filter) {
      query.or([{ number: filter }, { email: filter }]);
    }

    // Status
    if (status !== 'all') {
      query.find({ status });
    } else {
      query.find({
        status: { $in: ['draft', 'open', 'paid', 'uncollectible', 'void'] },
      });
    }

    // Not past due
    if (status === 'open' && !pastDue) {
      query.find().gte('due_date', new Date().toISOString());
    }

    // Past due
    if (pastDue) {
      query.find().lt('due_date', new Date().toISOString());
    }

    // Date range
    if (startDate) {
      query.find().gte('createdAt', new Date(startDate).toISOString());
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.find().lte('createdAt', end.toISOString());
    }

    // Get total number of rows
    const rowsNumber = await Invoice.find(query.getFilter()).countDocuments();

    // Sort
    if (sortBy) {
      query.sort({ [sortBy]: order });
    }

    // Paginate
    query.skip((pageNum - 1) * rowsPerPageNum).limit(rowsPerPageNum);

    // Execute query
    const invoices = await query.exec();

    console.log(success('Fetched invoices.'));
    res.status(200).json({
      invoices,
      rowsNumber,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getInvoice = async (req, res, next) => {
  console.log('Getting Invoice...');

  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      const error = new Error('Could not find invoice.');
      error.statusCode = 404;
      throw error;
    }
    console.log(success('Fetched invoice.'));
    res.status(200).json(invoice);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addInvoice = async (req, res, next) => {
  console.log('Adding invoice...');
  const form = req.body;
  let number = '';

  try {
    if (form.status === 'draft') {
      number = `${form.customer.invoice_prefix}-DRAFT`;
    } else {
      const totalDocs = await Invoice.find({
        'customer.id': form.customer.id,
        status: { $ne: 'draft' },
      }).countDocuments();

      number = `${form.customer.invoice_prefix}-${(totalDocs + 1)
        .toString()
        .padStart(4, '0')}`;
    }

    const invoice = new Invoice({
      customer: form.customer,
      description: form.description,
      due_date: form.due_date,
      footer: form.footer,
      lines: form.lines,
      number,
      shippable: form.shippable,
      shipping: form.shipping,
      status: form.status,
      subtotal: form.subtotal,
      total: form.total,
    });

    const result = await invoice.save();
    console.log(success('Added invoice.'));

    if (result.status_transitions.finalized_at) {
      const message = await emailInvoice(result);

      res.status(201).json({ message });
    } else {
      res.status(201).json({ message: 'Draft saved.' });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateInvoice = async (req, res, next) => {
  console.log('Updating invoice...');

  const form = req.body;
  const id = req.params.id;

  try {
    const invoice = await Invoice.findById(id);

    Object.assign(invoice, form);

    const result = await invoice.save();

    console.log(success('Updated invoice.'));
    res.status(200).json(result);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteInvoice = async (req, res, next) => {
  console.log('Deleting invoice...');

  const id = req.params.id;

  try {
    const invoice = await Invoice.findByIdAndDelete(id);

    console.log(success('Deleted invoice.'));
    res.status(200).json(invoice);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.payInvoice = async (req, res, next) => {
  console.log('Paying invoice...');

  const charge = req.body;
  const id = req.params.id;

  try {
    const invoice = await Invoice.findById(id);

    const result = await invoice.pay(charge);

    if (result.status_transitions.paid_at) {
      const message = await emailReceipt(result);

      console.log(success('Paid invoice.'));
      res.status(200).json({
        message,
        receipt: result.receipt_number,
        email: result.customer.email,
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
