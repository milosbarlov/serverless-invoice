const mongoose = require('mongoose');
const nanoid = require('nanoid');

const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    amount_due: Number,
    amount_paid: { type: Number, default: 0 },
    amount_remaining: {
      type: Number,
      default() {
        return this.amount_due - this.amount_paid;
      },
    },
    charge: { type: String, default: null },
    currency: {
      type: String,
      required: true,
    },
    customer: {
      type: Object,
      address: {
        city: String,
        country: String,
        line1: String,
        line2: String,
        postal_code: String,
        state: String,
      },
      email: String,
      id: {
        type: String,
        required: true,
      },
      name: String,
      phone: Number,
    },
    default_source: String,
    description: { type: String, default: '' },
    due_date: Date,
    hosted_invoice_url: { type: String, default: () => nanoid() },
    lines: { type: Object, default: null },
    number: String,
    paid: { type: Boolean, default: false },
    receipt_number: { type: String, default: null },
    status: { type: String, default: 'Open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
