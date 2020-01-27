const mongoose = require('mongoose');

const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    amount_paid: { type: Number, default: 0 },
    amount_remaining: {
      type: Number,
      default() {
        return this.total - this.amount_paid;
      },
    },
    charge: { type: String, default: null },
    customer: {
      type: Object,
      required: true,
      address: {
        city: { type: String, default: null },
        country: { type: String, default: null },
        line1: { type: String, default: null },
        line2: { type: String, default: null },
        postal_code: { type: String, default: null },
        state: { type: String, default: null },
      },
      currency: {
        type: String,
        required: true,
      },
      email: { type: String, default: null },
      id: {
        type: String,
        required: true,
      },
      invoice_prefix: { type: String, default: null },
      name: { type: String, default: null },
      phone: { type: Number, default: null },
    },
    default_source: { type: String, default: null },
    description: { type: String, default: null },
    discount: { type: Number, default: null },
    due_date: { type: Date, default: null },
    footer: { type: String, default: null },
    hosted_invoice_url: {
      type: String,
      default() {
        return `${process.env.API}/checkout/${this._id}`;
      },
    },
    lines: { type: Object, default: null },
    number: { type: String, required: true },
    paid: { type: Boolean, default: false },
    payment_method_details: { type: Object, default: null },
    receipt_number: { type: String, default: null },
    shippable: { type: Boolean, required: true },
    shipping: { type: Number, required: true },
    status: { type: String, required: true },
    status_transitions: {
      finalized_at: {
        type: Date,
        default() {
          if (this.status === 'open') {
            return Date.now();
          }
          return null;
        },
      },
      marked_uncollectible_at: { type: Date, default: null },
      paid_at: { type: Date, default: null },
      voided_at: { type: Date, default: null },
    },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

invoiceSchema.methods.pay = function(charge) {
  this.amount_paid = charge.amount;
  this.amount_remaining -= charge.amount;
  this.charge = charge.id;
  this.paid = true;
  this.payment_method_details = charge.payment_method_details;
  this.receipt_number = new mongoose.Types.ObjectId();
  this.status = 'paid';
  this.status_transitions.paid_at = Date.now();

  return this.save();
};

module.exports = mongoose.model('Invoice', invoiceSchema);
