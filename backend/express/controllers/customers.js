const parsePhoneNumberFromString = require('libphonenumber-js');

const stripe = require('stripe')(process.env.SK_TEST);
const { validationResult } = require('express-validator');
const chalk = require('chalk');

const success = chalk.green;

exports.getCustomers = async (req, res, next) => {
  console.log('Getting customers...');

  const {
    page,
    pageNum = +page,
    rowsPerPage,
    rowsPerPageNum = +rowsPerPage,
  } = req.query;
  const { sortBy, filter, startDate, endDate } = req.query;
  const descending = req.query.descending === 'true';
  const data = { customers: [] };

  try {
    let start;
    let end;

    if (startDate) {
      start = new Date(startDate);
      start = Math.floor(start.getTime() / 1000);
    }

    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      end = Math.floor(end.getTime() / 1000);
    }

    await stripe.customers
      .list({
        limit: 100,
        created: {
          gte: start,
          lte: end,
        },
      })
      .autoPagingEach(customer => {
        // const phoneNumber = parsePhoneNumberFromString(
        //   customer.shipping.phone,
        //   customer.shipping.address.country
        // );

        // data.customers.push({
        //   created: customer.created,
        //   id: customer.id,
        //   description: customer.description,
        //   email: customer.email,
        //   country: customer.shipping.address.country,
        //   phone: phoneNumber.formatInternational(),
        // });
        data.customers.push(customer);
      });

    console.log('Found customers...');

    if (filter) {
      data.customers = data.customers.filter(customer => {
        // const keys = Object.keys(customer);
        // keys.shift();

        const keys = ['description', 'id', 'email'];

        return keys.some(key => {
          if (customer[key]) {
            return customer[key].includes(filter.toLowerCase());
          }
          return false;
        });
      });
    }

    data.rowsNumber = data.customers.length;

    const des = descending ? -1 : 1;

    if (sortBy) {
      if (sortBy === 'created') {
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

    console.log(success('Fetched customers.'));
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
    console.error(errors.array());
    const error = new Error('Invalid input.');
    error.statusCode = 422;
    throw error;
  }

  const phoneNumber = parsePhoneNumberFromString(
    req.body.shipping.phone,
    req.body.shipping.address.country
  );

  const formattedNumber = phoneNumber.formatInternational();

  try {
    const response = await stripe.customers.create({
      address: {
        line1: req.body.address.line1,
        line2: req.body.address.line2,
        city: req.body.address.city,
        state: req.body.address.state,
        postal_code: req.body.address.postal_code,
        country: req.body.address.country,
      },
      currency: 'USD',
      description: req.body.description,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
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
        phone: formattedNumber || null,
      },
    });

    console.log(success('Added customer.'));
    res.status(201).json(response);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
