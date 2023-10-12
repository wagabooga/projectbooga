const mongoose = require('mongoose');
require('dotenv').config()



mongoose.connect(`mongodb+srv://waga:${process.env.DB_PASSWORD}@cluster0.l9iwjy1.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

module.exports = mongoose;