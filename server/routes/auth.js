const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STRONG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PW_MSG = 'Password needs 8+ characters with upper and lower case letters, a number and a symbol';
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
const pub = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, role = 'User', adminCode } = req.body;
    if (!name?.trim() || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (!EMAIL.test(email)) return res.status(400).json({ message: 'Enter a valid email address' });
    if (!STRONG.test(password)) return res.status(400).json({ message: PW_MSG });
    if (!['Admin', 'User'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    if (role === 'Admin' && adminCode !== process.env.ADMIN_SIGNUP_CODE)
      return res.status(403).json({ message: 'Incorrect admin code' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email is already registered' });

    const user = await User.create({ name, email, password, role });
    await Activity.create({ message: `New ${role.toLowerCase()} signed up: ${user.name}`, by: user.name });
    res.status(201).json({ token: sign(user), user: pub(user) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matches(password))) return res.status(401).json({ message: 'Incorrect email or password' });
    if (!user.active) return res.status(403).json({ message: 'This account is deactivated' });
    res.json({ token: sign(user), user: pub(user) });
  } catch (e) { next(e); }
});

router.get('/me', protect, (req, res) => res.json({ user: pub(req.user) }));

router.put('/change-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matches(currentPassword || ''))) return res.status(400).json({ message: 'Current password is incorrect' });
    if (!STRONG.test(newPassword || '')) return res.status(400).json({ message: PW_MSG });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (e) { next(e); }
});

module.exports = router;
