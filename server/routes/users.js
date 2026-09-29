const router = require('express').Router();
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
const log = (message, user) => Activity.create({ message, by: user.name });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STRONG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

router.get('/', async (req, res, next) => {
  try { res.json(await User.find().select('-password').sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, password, role = 'User' } = req.body;
    if (!name?.trim() || !EMAIL.test(email || '')) return res.status(400).json({ message: 'Valid name and email are required' });
    if (!STRONG.test(password || '')) return res.status(400).json({ message: 'Password is too weak' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email is already registered' });
    const u = await User.create({ name, email, password, role });
    await log(`Added user ${u.name}`, req.user);
    res.status(201).json({ ...u.toObject(), password: undefined });
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, role, active } = req.body;
    if (String(req.user._id) === req.params.id && (role === 'User' || active === false))
      return res.status(400).json({ message: 'You cannot demote or deactivate your own account' });
    const u = await User.findByIdAndUpdate(req.params.id, { name, email, role, active }, { new: true, runValidators: true }).select('-password');
    if (!u) return res.status(404).json({ message: 'User not found' });
    await log(`Updated user ${u.name}`, req.user);
    res.json(u);
  } catch (e) { e.status = e.code === 11000 ? 409 : 400; next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (String(req.user._id) === req.params.id) return res.status(400).json({ message: 'You cannot remove your own account' });
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    await log(`Removed user ${u.name}`, req.user);
    res.json({ message: 'User removed' });
  } catch (e) { next(e); }
});

module.exports = router;
