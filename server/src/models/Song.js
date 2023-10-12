const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
    name: { type: String, required: true },
    availableDifficulties: { type: Number, }
    // ...other song attributes
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;