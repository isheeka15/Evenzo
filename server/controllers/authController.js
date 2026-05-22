const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Email is already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role === 'organizer' ? 'organizer' : 'user',
  });

  if (newUser) {
    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id, newUser.role),
    });
  }

  res.status(500).json({ message: 'Failed to create user.' });
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  }

  res.status(401).json({ message: 'Invalid email or password.' });
};

const getProfile = async (req, res) => {
  if (req.user) {
    return res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  }
  res.status(404).json({ message: 'User not found.' });
};

module.exports = { registerUser, authUser, getProfile };
