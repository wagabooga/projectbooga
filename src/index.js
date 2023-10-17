const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');

dotenv.config();

const app = express();

app.use(express.json());

// Connecting to MongoDB
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// Middleware
app.use('/api/user', authRoute);

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});