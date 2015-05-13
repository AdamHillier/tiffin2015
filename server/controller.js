var Photo = require('./models/photo');
var Video = require('./models/video');
var Form = require('./models/form');

exports.getPhotos = function (req, res) {
    Photo.find({}, 'file year -_id', function (err, photos) {
        if (err) { return res.status(500).send('Internal error'); }
        return res.send(photos);
    });
}
exports.getVideos = function (req, res) {
    Video.find({}, 'form youtubeCode -_id', function (err, videos) {
        if (err) { return res.status(500).send('Internal error'); }
        return res.send(videos);
    });
}
exports.getForms = function (req, res) {
    Form.find({}, 'name tutor tutorText tutorTextAuthor studentText studentTextAuthor -_id', function (err, forms) {
        if (err) { return res.status(500).send('Internal error'); }
        return res.send(forms);
    });
}
exports.download = function (req, res) {

}
