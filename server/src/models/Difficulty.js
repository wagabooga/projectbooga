const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const difficultySchema = new Schema({
    level: { type: String, required: true }, // 1/2/3/4/ 5 sometimes
    // ...other difficulty attributes
});

const Difficulty = mongoose.model('Difficulty', difficultySchema);

module.exports = Difficulty;