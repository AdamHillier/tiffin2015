var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var database = require('./config/database');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var flash = require('connect-flash');

var passport = require('passport');

// TODO Secure cookie, depending on environment
app.use(session({
    name: 'sid', // TODO Get from config
    secret: 'changemechangemechangeme', // TODO Get from config
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ host: 'localhost', port: 6379, expire: 60*60*24*7 }) // TODO Get from config
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./auth');

app.engine('html', require('hogan-express'));
app.set('views', './server/views');
app.set('view engine', 'html');
app.set('layout', 'layouts/default');
require('./routes')(app);
app.use(express.static(__dirname + '/../public'));
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

// throw err if no connection?
mongoose.connect(database.url);
mongoose.connection.once('open', function () {
    console.log('db connected at %s', database.url);
});

var port = process.env.PORT || 3000;
http.listen(port);
console.log('listening on *:' + port);

