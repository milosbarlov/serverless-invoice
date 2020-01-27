const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const mjml2html = require('mjml');
const fs = require('fs');
const path = require('path');
const { currencyFormat } = require('../utils/currency');
const { config } = require('../config/config');

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  else {
    console.log('Access key:', AWS.config.credentials.accessKeyId);
    console.log('Secret access key:', AWS.config.credentials.secretAccessKey);
  }
});

AWS.config.update({ region: config.region });

const transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: '2010-12-01',
  }),
  sendingRate: config.sendingRate,
});

Handlebars.registerHelper('ifEquals', function(a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('capitalize', function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

exports.emailInvoice = invoice => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../template/invoice.mjml');
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      const template = Handlebars.compile(data);

      const formattedLines = invoice.lines.map(value => {
        const keys = ['amount', 'item_discount', 'unit_amount'];

        keys.forEach(key => {
          value[key] = currencyFormat(value[key]);
        });

        return value;
      });

      const dueDate = invoice.due_date.toDateString();
      const finalizedAt = invoice.status_transitions.finalized_at.toDateString();
      const formattedDiscount = currencyFormat(invoice.discount);
      const formattedShipping = currencyFormat(invoice.shipping);
      const formattedSubtotal = currencyFormat(invoice.subtotal);
      const formattedTotal = currencyFormat(invoice.total);

      const context = {
        customer: {
          email: invoice.customer.email,
          name: invoice.customer.name,
        },
        description: invoice.description,
        discount: formattedDiscount,
        due_date: dueDate,
        footer: invoice.footer,
        hosted_invoice_url: invoice.hosted_invoice_url,
        lines: formattedLines,
        number: invoice.number,
        shippable: invoice.shippable,
        shipping: formattedShipping,
        status_transitions: {
          finalized_at: finalizedAt,
        },
        subtotal: formattedSubtotal,
        total: formattedTotal,
      };
      const mjml = template(context);
      const htmlOutput = mjml2html(mjml);
      const message = {
        from: config.from,
        to: invoice.customer.email,
        subject: `Invoice #${invoice.number}`,
        html: htmlOutput.html,
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          reject(err);
        }
        console.log(
          `Emailed invoice from: '${info.envelope.from}' to: '${info.envelope.to}'.`
        );
        resolve('Emailed invoice.');
      });
    });
  });
};

exports.emailReceipt = invoice => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../template/receipt.mjml');
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      const template = Handlebars.compile(data);

      const formattedLines = invoice.lines.map(value => {
        const keys = ['amount', 'item_discount', 'unit_amount'];

        keys.forEach(key => {
          value[key] = currencyFormat(value[key]);
        });

        return value;
      });

      const formattedAmountPaid = currencyFormat(invoice.amount_paid);
      const paidAt = invoice.status_transitions.paid_at.toDateString();
      const formattedDiscount = currencyFormat(invoice.discount);
      const formattedShipping = currencyFormat(invoice.shipping);
      const formattedSubtotal = currencyFormat(invoice.subtotal);

      const context = {
        amount_paid: formattedAmountPaid,
        customer: {
          email: invoice.customer.email,
          name: invoice.customer.name,
        },
        discount: formattedDiscount,
        lines: formattedLines,
        number: invoice.number,
        payment_method_details: invoice.payment_method_details,
        receipt_number: invoice.receipt_number,
        shippable: invoice.shippable,
        shipping: formattedShipping,
        status_transitions: {
          paid_at: paidAt,
        },
        subtotal: formattedSubtotal,
      };

      const mjml = template(context);
      const htmlOutput = mjml2html(mjml);
      const message = {
        from: config.from,
        to: invoice.customer.email,
        subject: `Receipt #${invoice.receipt_number}`,
        html: htmlOutput.html,
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          reject(err);
        }
        console.log(
          `Emailed receipt from: '${info.envelope.from}' to: '${info.envelope.to}'.`
        );
        resolve('Emailed receipt.');
      });
    });
  });
};
