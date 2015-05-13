var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    photoURL: { type: String },
    facebookID: { type: String, required: true, index: { unique: true } },
    verified: { type: Boolean, required: true }
});

module.exports = mongoose.model('User', userSchema);
