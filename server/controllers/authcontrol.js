const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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


exports.login = async (req, res) => {
  const { email, password, role } = req.body; 

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

  
    if (role && user.role !== role) {
      return res.status(403).json({ error: `Unauthorized. This login requires ${role} role.` });
    }

    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token ,role});
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getuser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      name: user.name,
      email: user.email,
      joinedDate: user.createdAt,
      membership: user.role === 'jobSeeker' ? 'Basic Member' : 'Premium Member',
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

