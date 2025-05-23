const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  catg: String,
  imagePath: String,
  modelPath: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
 