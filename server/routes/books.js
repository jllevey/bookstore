const router = require('express').Router();
const Book = require('../models/Book');
const Activity = require('../models/Activity');
const { protect, adminOnly } = require('../middleware/auth');

const log = (message, user) => Activity.create({ message, by: user.name });
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// All logged-in users: search by title/author, filter by genre
router.get('/', protect, async (req, res, next) => {
  try {
    const { q, genre } = req.query;
    const filter = {};
    if (q) filter.$or = [{ title: new RegExp(esc(q), 'i') }, { author: new RegExp(esc(q), 'i') }];
    if (genre) filter.genre = genre;
    res.json(await Book.find(filter).sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

router.get('/genres', protect, async (req, res, next) => {
  try { res.json(await Book.distinct('genre')); } catch (e) { next(e); }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (e) { next(e); }
});

// Admin only below
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    await log(`Added book "${book.title}"`, req.user);
    res.status(201).json(book);
  } catch (e) { e.status = 400; next(e); }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await log(`Updated book "${book.title}"`, req.user);
    res.json(book);
  } catch (e) { e.status = 400; next(e); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await log(`Deleted book "${book.title}"`, req.user);
    res.json({ message: 'Book deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
