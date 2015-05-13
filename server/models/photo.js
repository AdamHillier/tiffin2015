var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    file: { type: String, required: true },
    year: { type: String, required: true }, // 7, 8, 9 ... L6, U6
    caption: { type: String }
});

module.exports = mongoose.model('Photo', photoSchema);
