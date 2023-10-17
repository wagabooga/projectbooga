const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const router = require('express').Router();


// Configure Nodemailer
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mattyhutwojk@gmail.com',
        pass: 'Memelord69420!'
    }
});


// Salt rounds for bcrypt hashing
const saltRounds = 10;

// Secret key for JWT signing
const jwtSecret = 'YOUR_SECRET_KEY'; // You might want to store this in environment variables

// User Registration
router.post('/register', async (req, res) => {
    console.log("hit register")
    try {
        // Hashing the user password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        
        // Creating a new user
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
        });

        // Saving the user to the database
        const savedUser = await user.save();
        res.status(201).send({ message: 'Registration successful', userId: savedUser._id });

    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send('Email already registered');
        } else {
            res.status(400).send('Registration failed, please try again');
        }
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        // Finding the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Email or password is wrong');

        // Comparing hashed passwords
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Email or password is wrong');

        // Creating a JWT token
        const token = jwt.sign({ _id: user._id }, jwtSecret);
        res.header('auth-token', token).send({ message: 'Login successful', token: token });

    } catch (err) {
        res.status(400).send('Login failed, please check your credentials and try again');
    }
});

router.post('/password-reset', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('No account with that email address exists.');

        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();
        // Send email with the temporary password
        let mailOptions = {
            from: 'YOUR_EMAIL@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            text: `Your temporary password is: ${tempPassword}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.status(400).send('Failed to send the email, please try again');
            res.send('Email sent with the temporary password');
        });

    } catch (err) {
        res.status(400).send('An error occurred while resetting the password.');
    }
});

module.exports = router