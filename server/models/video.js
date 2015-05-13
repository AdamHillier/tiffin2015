var mongoose = require('mongoose');

var videoSchema = new mongoose.Schema({
    form: { type: String, required: true },
    youtubeCode: { type: String, required: true }
});

module.exports = mongoose.model('Video', videoSchema);
