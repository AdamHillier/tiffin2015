var Photo = require('./models/photo');
var Video = require('./models/video');
var path = require('path');

exports.getPhotos = function (req, res) {
    Photo.find({}, 'file date width height thumbAspectRatio -_id', function (err, photos) {
        if (err) { return res.status(500).send('Internal error'); }
        res.send(photos);
    });
}
exports.getPhoto = function (req, res) {
    var file = req.params.photo;
    try {
        res.sendFile(path.join(__dirname, '/../photos', file));
    } catch (err) {
        res.status(404).send('404');
    }
}
exports.getPhotoThumb = function (req, res) {
    var file = req.params.photo;
    try {
        res.sendFile(path.join(__dirname, '/../photos/thumb', file));
    } catch (err) {
        res.status(404).send('404');
    }
}
exports.getVideos = function (req, res) {
    Video.find({}, 'form youtubeCode -_id', function (err, videos) {
        if (err) { return res.status(500).send('Internal error'); }
        res.send(videos);
    });
}
