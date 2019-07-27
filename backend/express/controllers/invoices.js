const Invoice = require('../models/invoice.js');

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
  const order = descending ? -1 : 1;

  try {
    // Query invoice
    const query = Invoice.find();

    // Filter
    if (filter) {
      query.or([{ number: filter }, { email: filter }]);
    }

    // Status
    if (status) {
      query.find({ status });
    }

    // Date range
    if (startDate && endDate) {
      query
        .find()
        .where('createdAt')
        .gte(startDate)
        .lte(endDate);
    } else {
      if (startDate) {
        query.find().gte('createdAt', startDate);
      }
      if (endDate) {
        query.find().lte('createdAt', endDate);
      }
    }

    const rowsNumber = await Invoice.find(query.getFilter()).countDocuments();

    // Sort
    if (sortBy) {
      query.sort({ [sortBy]: order });
    }

    // Paginate
    query.skip((pageNum - 1) * rowsPerPageNum).limit(rowsPerPageNum);

    const invoices = await query.exec();

    console.log('Sent invoices.');
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
    console.log('Sent invoice.');
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

  try {
    const totalDocs = await Invoice.find({
      'customer.id': form.customer.id,
    }).countDocuments();

    const number = `${form.invoice_prefix}-${(totalDocs + 1)
      .toString()
      .padStart(4, '0')}`;

    const invoice = new Invoice({
      amount_due: form.amount_due,
      amount_remaining: form.amount_due,
      currency: form.currency,
      customer: form.customer,
      description: form.description,
      due_date: form.due_date,
      lines: form.lines,
      number,
      total: form.amount_due,
    });

    await invoice.save();
    console.log('Added invoice.');
    res.status(201).json(invoice);
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

    console.log('Updated invoice.');
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

    console.log('Deleted invoice.');
    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
  }
};
