const mongoose = require('mongoose');

const { Schema } = mongoose;

const settingSchema = new Schema({
  address: {
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    line1: { type: String, default: '' },
    line2: { type: String, default: '' },
    postal_code: { type: String, default: '' },
    state: { type: String, default: '' },
  },
  email: { type: String, default: '' },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
});

module.exports = mongoose.model('Setting', settingSchema);
