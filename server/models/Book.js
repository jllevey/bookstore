const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, default: '' },
    coverUrl: { type: String, default: '' }
  },
  { timestamps: true }
);
bookSchema.virtual('available').get(function () { return this.stock > 0; });
bookSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);
