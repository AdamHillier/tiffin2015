var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    file: { type: String, required: true },
    date: { type: Date, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    thumbAspectRatio: { type: Number, required: true },
    caption: { type: String }
});

module.exports = mongoose.model('Photo', photoSchema);
