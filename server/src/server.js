const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});