const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const router = require('express').Router();
const { registerValidation } = require('../validators/userValidator');

// // Configure Nodemailer
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'email@gmail.com',
//         pass: 'password123!'
//     }
// });


// Salt rounds for bcrypt hashing
const saltRounds = 10;

// Secret key for JWT signing
const jwtSecret = 'YOUR_SECRET_KEY'; // You might want to store this in environment variables

// User Registration
router.post('/register', async (req, res) => {
    // Validate the user input
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
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