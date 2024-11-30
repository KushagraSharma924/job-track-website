const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration Endpoint
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!['jobSeeker', 'employer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    if (role === 'jobSeeker') {
      res.status(201).json({ message: 'User registered successfully' });
    } else {
      res.status(201).json({ message: 'Admin registered successfully' });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login Endpoint
exports.login = async (req, res) => {
  const { email, password, role } = req.body; // Role added to the request payload

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Validate role
    if (role && user.role !== role) {
      return res.status(403).json({ error: `Unauthorized. This login requires ${role} role.` });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token ,role});
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};