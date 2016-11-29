var express = require('express');
var passport = require('passport');
var FitbitApiClient = require('fitbit-node');
var router = express.Router();

var db = require('../config/queries');
var apipath = '/api/v1/';
const path = require('path');
var data;
var client = new FitbitApiClient(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
});

router.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'sign-in', 'partial-signin.html'));
});

router.get(apipath + 'users', db.getAllUsers);
router.get(apipath + 'users/:id', db.getSingleUser);
router.get(apipath + 'users/:id/teams', db.getUserTeams)
router.get(apipath + 'team/:id', db.getTeamMembers);
router.get(apipath + 'shoes/:id', db.getUserShoes);
router.get(apipath + 'prs/:id', db.getUserPRs);
router.post(apipath + '/deviceinfo', db.addDeviceInfo);
router.post(apipath + 'team', db.createTeam);
router.post(apipath + 'shoes', db.createShoe);
router.post(apipath + 'prs', db.createPR);
router.post(apipath + 'logs', db.createLog);
router.put(apipath + 'users/:id', db.updateUser);
router.delete(apipath + 'users/:id', db.removeUser);

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

router.get(apipath + 'logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Logged out!'
    });
});

router.get(apipath + 'fitbit', function(req, res) {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
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
            addDeviceInfo(data);
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
            addDeviceInfo(data);
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
            addDeviceInfo(data);
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

module.exports = router;
