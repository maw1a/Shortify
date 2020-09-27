const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  id: {
    type: String,
    required: "ID is required!"
  },
  url: {
    type: String,
    required: "URL is required!"
  },
  visitors: {
    type: Number,
    required: "Visits on this url!"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Url', urlSchema);