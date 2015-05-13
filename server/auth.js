var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var User = require('./models/user');
var config = require('./config/facebook');
var request = require('request')

var whiteList = ['10202787337923719'];

passport.use(new FacebookStrategy({
        clientID: config.id,
        clientSecret: config.secret,
        callbackURL: config.callbackUrl
    },
    function (accessToken, refreshToken, profile, done) {
        checkPermissions(accessToken, function (err, permissionsOkay) {
            if (err) { return done(null, false, { message: 'An error occurred :( please try again later.' } ); }
            if (!permissionsOkay) {
                permissionsOkay = false;
                return saveUser(profile, false, function (err, user) {
                    if (err || !user) { return done(err); }
                    done(null, false, { message: 'You need to allow this site to view your Facebook friends in order to confirm your identity.</p><a class=\'pure-button pure-button-primary pure-button-xlarge\' href=\'/login/facebook/permission\'>Give permission</a><p>' });
                });
            }
            User.findOne({ facebookID: profile.id }, function (err, user) {
                if (user && user.verified) {
                    checkUser(user, profile, function (err, user) {
                        if (err || !user) { return done(err); }
                        return done(null, user);
                    });
                }
                else {
                    verify(profile.id, accessToken, function (err, accessGranted) {
                        if (!accessGranted) { accessGranted = false; }
                        saveUser(profile, accessGranted, function (err, user) {
                            if (err || !user) { return done(err); }
                            if (!accessGranted) {
                                return done(err, false, { message: 'Unfortunately I was unable to automatically confirm your identity.<br><br><a href=\'https://www.facebook.com/adamcs.hillier\'>Get in touch</a> and I can manually give you access.' });
                            }
                            done(null, user);
                        });
                    });
                }
            });
        });
    }));

function checkPermissions(accessToken, done) {
    fbGet('https://graph.facebook.com/me/permissions?access_token=' + accessToken, [], function (err, permissions) {
        if (err || !permissions) {
            return done(err);
        }
        for (var i = 0; i < permissions.length; i++) {
            if (permissions[i].permission === 'user_friends' && permissions[i].status === 'granted') {
                return done(null, true);
            }
        }
        done(err);
    });
}

function verify(id, accessToken, done) {
    if (whiteList.indexOf(id) !== -1) {
        return done(null, true);
    }
    fbGet('https://graph.facebook.com/me/friends?access_token=' + accessToken, [], function (err, friends) {
        if (err || !friends) {
            return done(err);
        }
        var friendIds = [];
        for (var i = 0; i < friends.length; i++) {
            friendIds.push(friends[i].id);
        }
        User.find({ verified: true }, function (err, users) {
            if (!err && users) {
                var count = 0;
                for (var i = 0; i < users.length; i++) {
                    if (friendIds.indexOf(users[i].facebookID.toString()) !== -1) {
                        count += 1;
                    }
                }
                if (count/users.length >= 0.95) { return done(null, true); }
                return done(null, false);
            }
            return done(err);
        });
    });
}

function checkUser(user, profile, done) {
    var count = 0;
    if (user.firstName === profile.name.givenName) { count += 1; }
    if (user.lastName === profile.name.familyName) { count += 1; }
    if (count === 2) { return done(null, user); }
    user.update({ firstName: profile.name.givenName, lastName: profile.name.familyName }, function (err, user) {
        if (err || !user) { return done(err); }
        done(null, user);
    });
}

function saveUser(profile, verified, done) {
    var user = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        verified: verified
    };
    User.findOneAndUpdate({ facebookID: profile.id }, user, { upsert: true, new: true }, function (err, user) {
        if (err || !user) { return done(err); }
        done(null, user);
    });
}

function fbGet(url, data, done) {
    request(url, function (err, response, body) {
        if (!err && response.statusCode === 200) {
            body = JSON.parse(body);
            data = data.concat(body.data);
            if (body.paging && body.paging.next) {
                fbGet(body.paging.next, data, done);
            } else {
                done(null, data);
            }
        } else {
            done(err);
        }
    });
}

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
