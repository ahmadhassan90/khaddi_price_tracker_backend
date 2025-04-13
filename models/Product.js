const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  url: String,
  targetPrice: Number,
  email: String,
  currentPrice: Number,
});

module.exports = mongoose.model('Product', ProductSchema);
