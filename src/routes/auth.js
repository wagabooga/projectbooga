const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const router = require('express').Router();
const { registerValidation, loginValidation} = require('../validators/userValidator');

// // Configure Nodemailer
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'email@gmail.com',
//         pass: 'password123!'
//     }
// });


// Secret key for JWT signing
// const jwtSecret = process.env.JWT_SECRET; // You might want to store this in environment variables

// User Registration
router.post('/register', async (req, res) => {
    // Validate the user input
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    // Create a new user
    const user = new User({
        email: req.body.email,
        password: req.body.password  // saving plain text password, middleware will hash it
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});


// User Login
router.post('/login', async (req, res) => {
    // You can add a login validation similar to the registration validation
    const { error } = loginValidation(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // Finding the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid Credentials'); // Generalized error message

        // Comparing hashed passwords
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Invalid Credentials'); // Generalized error message

        // Creating a JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.header('auth-token', token).send({ message: 'Login successful', token: token });

    } catch (err) {
        res.status(500).send('An error occurred while trying to log in'); // General server error
    }
});


module.exports = router