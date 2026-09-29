const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  { book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, title: String, author: String, price: Number, qty: Number },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNo: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customer: { name: String, phone: String, address: String },
    paymentMethod: { type: String, enum: ['Cash on delivery', 'UPI (demo)', 'Card (demo)'], default: 'Cash on delivery' },
    items: [itemSchema],
    subtotal: Number,
    delivery: Number,
    tax: Number,
    total: Number,
    status: { type: String, default: 'Placed' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
