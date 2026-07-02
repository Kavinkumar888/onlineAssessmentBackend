const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

const registerAdmin = async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'admin@gmail.com' });
    if (existing) return res.status(200).json({ message: 'Admin already exists' });

    const passwordHash = await bcrypt.hash('eatek@123', 10);
    const admin = await User.create({
      name: 'System Admin',
      registerNumber: 'ADMIN001',
      email: 'admin@gmail.com',
      password: passwordHash,
      role: 'admin',
      status: 'active'
    });

    await ActivityLog.create({ user: admin._id, action: 'Admin created' });
    res.status(201).json({ message: 'Default admin created', admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { registerNumber: identifier }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.status !== 'active') return res.status(403).json({ message: 'Account disabled' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    await ActivityLog.create({ user: user._id, action: 'Login' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        registerNumber: user.registerNumber,
        department: user.department,
        year: user.year,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerAdmin, login, getMe };
