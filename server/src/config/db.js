const mongoose = require('mongoose');
const pass = "LckZoMpQ26tvuuiH";

mongoose.connect(`mongodb+srv://waga:${pass}@cluster0.l9iwjy1.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

module.exports = mongoose;