const router = require('express').Router();
const Book = require('../models/Book');
const Order = require('../models/Order');
const Activity = require('../models/Activity');
const pricing = require('../config/pricing');
const { protect, adminOnly } = require('../middleware/auth');

const round = (n) => Math.round(n * 100) / 100;
function totals(subtotal) {
  const delivery = subtotal === 0 || subtotal >= pricing.freeDeliveryOver ? 0 : pricing.deliveryFee;
  const tax = round(subtotal * pricing.taxRate);
  return { subtotal: round(subtotal), delivery, tax, total: round(subtotal + delivery + tax) };
}

router.get('/pricing', protect, (req, res) => res.json(pricing));

router.get('/mine', protect, async (req, res, next) => {
  try { res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.get('/', protect, adminOnly, async (req, res, next) => {
  try { res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'Admin' && String(order.user) !== String(req.user._id))
      return res.status(403).json({ message: 'This order belongs to someone else' });
    res.json(order);
  } catch (e) {
    if (e.name === 'CastError') return res.status(404).json({ message: 'Order not found' });
    next(e);
  }
});

// Place an order: checks stock, takes the copies off the shelf, and saves the bill.
router.post('/', protect, async (req, res, next) => {
  const taken = [];
  try {
    const { items, customer = {}, paymentMethod } = req.body;
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Your cart is empty' });

    const name = (customer.name || '').trim();
    const phone = (customer.phone || '').trim();
    const address = (customer.address || '').trim();
    if (!name || !address) return res.status(400).json({ message: 'Name and delivery address are required' });
    if (!/^[0-9+\-\s]{7,15}$/.test(phone)) return res.status(400).json({ message: 'Enter a valid phone number' });
    const method = ['Cash on delivery', 'UPI (demo)', 'Card (demo)'].includes(paymentMethod) ? paymentMethod : 'Cash on delivery';

    const wanted = new Map();
    for (const it of items) {
      const qty = Number(it.qty);
      if (!it.bookId || !Number.isInteger(qty) || qty < 1 || qty > 20) return res.status(400).json({ message: 'Invalid quantity in your cart' });
      wanted.set(String(it.bookId), (wanted.get(String(it.bookId)) || 0) + qty);
    }

    const books = await Book.find({ _id: { $in: [...wanted.keys()] } });
    if (books.length !== wanted.size) return res.status(400).json({ message: 'A book in your cart is no longer available' });
    const lines = books.map((b) => ({ book: b, qty: wanted.get(String(b._id)) }));

    for (const l of lines) {
      const ok = await Book.findOneAndUpdate({ _id: l.book._id, stock: { $gte: l.qty } }, { $inc: { stock: -l.qty } });
      if (!ok) {
        const e = new Error(`Not enough copies of "${l.book.title}" in stock`);
        e.status = 409;
        throw e;
      }
      taken.push(l);
    }

    const t = totals(lines.reduce((s, l) => s + l.book.price * l.qty, 0));
    const order = await Order.create({
      orderNo: 'ORD-' + Date.now().toString(36).toUpperCase(),
      user: req.user._id,
      customer: { name, phone, address },
      paymentMethod: method,
      items: lines.map((l) => ({ book: l.book._id, title: l.book.title, author: l.book.author, price: l.book.price, qty: l.qty })),
      ...t
    });
    await Activity.create({ message: `${req.user.name} placed order ${order.orderNo}`, by: req.user.name });
    res.status(201).json(order);
  } catch (e) {
    for (const l of taken) await Book.updateOne({ _id: l.book._id }, { $inc: { stock: l.qty } }).catch(() => {});
    if (e.name === 'CastError') e.status = 400;
    next(e);
  }
});

module.exports = router;
