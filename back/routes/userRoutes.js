const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

const SALT_ROUNDS = 10;

const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return regex.test(password);
};

router.post('/register', async (req, res) => {
  const { studentNumber, name, password, major } = req.body;

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters and include both letters and numbers'
    });
  }

  try {
    const existingUser = await User.findOne({ studentNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      studentNumber,
      name,
      password: hashedPassword,
      major,
      favorites: []
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
    const { studentNumber, password } = req.body;
  
    try {
      const user = await User.findOne({ studentNumber });
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // (추후에 JWT 토큰 발급 자리!)
      res.status(200).json({ message: 'Login successful', user: {
        studentNumber: user.studentNumber,
        name: user.name,
        major: user.major
      }});
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;



