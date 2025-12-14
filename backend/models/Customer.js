const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  number: String,
  order_status: String,
  order_id: String,
  notes: String
});

module.exports = mongoose.model('Customer', customerSchema);
