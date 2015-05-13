var mongoose = require('mongoose');

var formSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tutor: [{ type: String, required: true }],
    tutorText: { type: String },
    tutorTextAuthor: { type: String },
    studentText: { type: String, required: true },
    studentTextAuthor: { type: String, required: true }
});

module.exports = mongoose.model('Form', formSchema);
