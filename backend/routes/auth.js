const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Missing JWT_SECRET in environment. Set JWT_SECRET in backend/.env');
}

function ensureJwtSecret(res) {
  if (!JWT_SECRET) {
    console.error('Attempted auth operation but JWT_SECRET is not set');
    res.status(500).send({ error: 'Server misconfiguration: JWT_SECRET not set' });
    return false;
  }
  return true;
}

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).send({ error: 'Please provide name, email and password' });

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).send({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashed });
    await user.save();

    if (!ensureJwtSecret(res)) return;
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(201).send({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).send({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send({ error: 'Please provide email and password' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ error: 'Invalid credentials' });

    if (!ensureJwtSecret(res)) return;
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(200).send({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
