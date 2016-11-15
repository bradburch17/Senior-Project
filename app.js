var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var passport = require('passport');
var flash = require('connect-flash');
//var jwt = require('jsonwebtoken');

var routes = require('./routes/index');
var config = require('./config/config');
//passport stuff
var session = require('express-session');
// var pg = require('pg');
// var conString = config.database;
// var client = new pg.Client(conString);


var app = express();

require('./config/passport')(passport);

app.set('superSecret', config.secret);
app.use(favicon(path.join(__dirname, 'app', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
//Passport Stuff////////////////////////////////////////////////////////////////////
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
///////////////////////////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'app')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.code || 500)
            .json({
                status: 'error',
                message: err
            });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
        .json({
            status: 'error',
            message: err.message
        });
});


module.exports = app;
