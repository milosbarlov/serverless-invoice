const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  business_profile: {
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
  },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
