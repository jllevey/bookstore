const router = require('express').Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Order = require('../models/Order');
const Activity = require('../models/Activity');
const { protect, adminOnly } = require('../middleware/auth');

// Public numbers for the welcome page (no login needed)
router.get('/public', async (req, res, next) => {
  try {
    const [books, genres] = await Promise.all([Book.countDocuments(), Book.distinct('genre')]);
    res.json({ books, genres: genres.length });
  } catch (e) { next(e); }
});

router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const [books, users, outOfStock, orders, revenueAgg, recent] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
      Book.countDocuments({ stock: 0 }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Activity.find().sort({ createdAt: -1 }).limit(8)
    ]);
    res.json({ books, users, outOfStock, orders, revenue: revenueAgg[0]?.total || 0, recent });
  } catch (e) { next(e); }
});

module.exports = router;
