var express = require('express');
var passport = require('passport');
var FitbitApiClient = require('fitbit-node');
var router = express.Router();

var get = require('../config/getQueries');
var create = require('../config/createQueries');
var update = require('../config/updateQueries');
var remove = require('../config/deleteQueries')
var apipath = '/api/v1/';
var User = require('../app/models/user');
var nodemailer = require('nodemailer');
var Helper = require('./routehelper');
const path = require('path');
var data;
var client = new FitbitApiClient(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
});

router.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'sign-in', 'partial-signin.html'));
});

router.get(apipath + 'users', get.getAllUsers);
router.get(apipath + 'users/:id', get.getSingleUser);
router.get(apipath + 'users/:id/teams', get.getUserTeams);
router.get(apipath + 'team/:id', get.getTeamMembers);
router.get(apipath + 'user/shoes/:id', get.getUserShoes);
router.get(apipath + 'user/prs/:id', get.getUserPRs);
router.get(apipath + 'activities', get.getActivities);
router.get(apipath + 'teams', get.getAllTeams);
router.get(apipath + 'user/:id/logs', get.getUserLogs);

router.post(apipath + 'team', create.createTeam);
router.post(apipath + 'team/join/:id', create.joinTeam);
router.post(apipath + 'shoes', create.createShoe);
router.post(apipath + 'prs', create.createPR);
router.post(apipath + 'logs', create.createLog);

router.put(apipath + 'users/:id', update.updateUser);
router.put(apipath + 'logs/:id', update.updateLog);
router.put(apipath + 'team/:id', update.updateTeam);
router.put(apipath + 'shoes/:id', update.updateShoe);
router.put(apipath + 'prs/:id', update.updatePR);

router.delete(apipath + 'users/:id', remove.removeUser);
router.delete(apipath + 'shoe/:id', remove.removeShoe);
router.delete(apipath + 'pr/:id', remove.removePR);
router.delete(apipath + 'logs/:id', remove.removeLog);

router.post(apipath + 'register', passport.authenticate('local-signup'), function(req, res, err) {
    res.json(req.user);
});

router.post(apipath + 'login', passport.authenticate('local-login'), function(req, res, err) {
    res.json(req.user);
});

router.get(apipath + 'auth', function(req, res) {
    if (req.isAuthenticated())
        return res.status(200).json({
            status: true,
            data: req.user,
            message: 'Returned one user'
        })
    else {
        res.status(200);
        res.json({
            status: false,
            errors: [{
                message: 'not authorized'
            }]
        });
    }
});

router.post(apipath + 'forgotpass', function(req, res) {
    var token;
    var token;
    User.findByEmail(req.body.email, function(err, user) {
        if (!user) {
            console.log('User does not exist');
            return res.redirect('/forgot');
        } else {
            console.log(user.username);
            token = Helper.encrypt(user.username);
            console.log(token);
            sendEmail(token, req.body.email);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'Sent recovery email'
                })
        }
    });
});

router.put(apipath + 'passwordchange/:token', update.updatePassword);

router.get(apipath + 'logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Logged out!'
    });
});

router.get(apipath + 'fitbit', function(req, res) {
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', process.env.CALLBACK_URL));
});

router.get(apipath + 'fitbit/callback', function(req, res) {
    client.getAccessToken(req.query.code, process.env.CALLBACK_URL).then(function(result) {
        req.session.authorized = true;
        req.session.access_token = result.access_token;
        req.session.save();
        res.redirect("/");
    }).catch(function(error) {
        res.send(error);
    });
});

router.get(apipath + 'fitbit/auth', function(req, res) {
    if (req.session.authorized) {
        console.log('We are in the auth');
        res.json({
            status: req.session.authorized,
            message: 'Returned authentication'
        });
    } else {
        console.log('We are in the else auth');
        res.json({
            status: false,
            message: 'Returned authentication'
        });
    }
});

router.get(apipath + 'fitbit/activity/today', function(req, res) {
    if (req.session.authorized) {
        client.get('/activities/date/today.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        })
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
});

router.get(apipath + 'fitbit/activity/:date', function(req, res) {
    if (req.session.authorized) {
        var date = req.params.date;
        client.get('/activities/date/' + date + '.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        })
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
});

router.get(apipath + 'fitbit/heartrate', function(req, res) {
    if (req.session.authorized) {
        client.get('/activities/heart/date/today/1d/1sec/time/00:00/00:01.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        })
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
});

router.get(apipath + 'fitbit/profile.json', function(req, res) {
    if (req.session.authorized) {
        client.get('/profile.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        });
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
});

router.get(apipath + 'fitbit/sleep/today', function(req, res) {
    if (req.session.authorized) {
        client.get('/sleep/date/today.json', req.session.access_token).then(function(results) {
            data = results[0];
            addDeviceInfo(data);
            res.json(results[0]);
        });
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
});

router.get(apipath + 'fitbit/sleep/:date', function(req, res) {
    if (req.session.authorized) {
        var date = req.params.date;
        client.get('/sleep/date/' + date + '.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        })
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.json({
        error: 'Not logged In'
    });
    res.redirect('/#/login');
}

function sendEmail(token, email) {
  console.log(token);
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: 'joggersandloggers@gmail.com',
        to: email,
        subject: 'Joggers and Loggers Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            // 'https://joggersandloggers.herokuapp.com/#/passwordchange/' + token + '\n\n' +
            'http://localhost:3000/#/passwordchange/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    smtpTransport.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
        }
        console.log(info);
    });
}

module.exports = router;
