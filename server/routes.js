var passport = require('passport');
var controller = require('./controller');

function isAuthorised(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}
function isUnauthorised(req, res, next) {
    if (!req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

module.exports = function (app) {
    app.get('/', isAuthorised, function (req, res) { res.render('index.html'); });
    app.get('/login', isUnauthorised, function (req, res) { res.render('login.html', { error: req.flash('error') }); });
    app.get('/login/facebook', isUnauthorised, passport.authenticate('facebook', { scope: ['user_friends', 'public_profile'] }));
    app.get('/login/callback', isUnauthorised, passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));
    app.get('/login/facebook/permission', isUnauthorised, passport.authenticate('facebook', { authType: 'rerequest', scope: ['user_friends', 'public_profile'] }));
    app.get('/logout', isAuthorised, function (req, res){
        req.logout();
        res.redirect('/');
    });
    app.get('/photos', isAuthorised, controller.getPhotos);
    app.get('/photos/:photo', isAuthorised, controller.getPhoto);
    app.get('/photos/:photo/thumb', isAuthorised, controller.getPhotoThumb)
    app.get('/videos', isAuthorised, controller.getVideos);
    app.get('/forms', isAuthorised, controller.getForms);
}
