import { parsePhoneNumberFromString } from 'libphonenumber-js';

const stripe = require('stripe')(process.env.SK_TEST);
const { validationResult } = require('express-validator/check');

exports.getCustomers = async (req, res, next) => {
  console.log('Getting customers...');

  const {
    page,
    pageNum = +page,
    rowsPerPage,
    rowsPerPageNum = +rowsPerPage,
  } = req.query;
  const { sortBy, filter, startDate, endDate } = req.query || '';
  const descending = req.params.query === 'true';
  const data = { customers: [] };

  try {
    await stripe.customers
      .list({
        limit: 100,
        created: {
          gte: startDate,
          lte: endDate,
        },
      })
      .autoPagingEach(async customer => {
        const phoneNumber = parsePhoneNumberFromString(
          customer.shipping.phone,
          customer.shipping.address.country
        );

        data.customers.push({
          date: customer.created,
          id: customer.id,
          description: customer.description,
          email: customer.email,
          country: customer.shipping.address.country,
          phone: phoneNumber.formatInternational(),
        });
      });

    console.log('Found customers.');

    if (filter) {
      data.customers = data.customers.filter(customer => {
        const keys = Object.keys(customer);
        keys.shift();

        return keys.some(key => customer[key].includes(filter.toLowerCase()));
      });
    }

    data.rowsNumber = data.customers.length;

    const des = descending ? -1 : 1;

    if (sortBy) {
      if (sortBy === 'date') {
        data.customers.sort((a, b) => (a[sortBy] - b[sortBy]) * des);
      } else {
        data.customers.sort((a, b) => {
          const x = a[sortBy].toLowerCase();
          const y = b[sortBy].toLowerCase();
          if (x < y) {
            return -1 * des;
          }
          if (x > y) {
            return 1 * des;
          }
          return 0;
        });
      }
    }

    if (rowsPerPageNum) {
      data.customers = data.customers.slice(
        (pageNum - 1) * rowsPerPageNum,
        pageNum * rowsPerPageNum
      );
    }

    console.log('Sent customers.');
    res.status(200).json(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addCustomer = async (req, res, next) => {
  console.log('Adding customer...');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Invalid input.');
    error.statusCode = 422;
    throw error;
  }

  const phoneNumber = parsePhoneNumberFromString(
    req.body.shipping.phone,
    req.body.shipping.address.country
  );

  try {
    const response = await stripe.customers.create({
      description: req.body.customer_description,
      email: req.body.email,
      shipping: {
        address: {
          city: req.body.shipping.address.city,
          country: req.body.shipping.address.country,
          line1: req.body.shipping.address.line1,
          line2: req.body.shipping.address.line2,
          postal_code: req.body.shipping.address.postal_code,
          state: req.body.shipping.address.state,
        },
        name: req.body.shipping.name,
        phone: phoneNumber.formatInternational(),
      },
    });

    console.log('Added customer.');
    res.status(201).json(response);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
