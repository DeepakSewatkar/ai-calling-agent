const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  sid: String,
  name: String,
  number: String,
  order_status: String,
  time: Date,
  source: String
});

module.exports = mongoose.model('CallLog', callLogSchema);
