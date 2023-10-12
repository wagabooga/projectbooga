const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/api/register', async (req, res) => {
  console.log("hit reg: req.body", req.body);

  try {
    const { username, password } = req.body;
    const saltRounds = 10;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create a new user with hashed password
    const newUser = new User({ username, password: hashedPassword });
    
    // Save the user to the database
    await newUser.save();
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;