var express = require('express');
var passport = require('passport');
var FitbitApiClient = require('fitbit-node');
var router = express.Router();

var db = require('../queries');
var config = require('../config/config');
var apipath = '/api/v1/';
const path = require('path');
var data;
var client = new FitbitApiClient(config.CLIENT_ID, config.CLIENT_SECRET);

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
});

router.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'sign-in', 'partial-signin.html'));
});

router.get(apipath + 'users', db.getAllUsers);
router.get(apipath + 'users/:id', db.getSingleUser);
router.get(apipath + 'team', db.getTeamMembers);
router.post(apipath + '/deviceinfo', db.addDeviceInfo);
router.post(apipath + 'teams', db.createTeam);
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
        res.status(403);
        res.json({
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

///////////////////////////////////////////

router.get(apipath + 'fitbit', function(req, res) {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', config.CALLBACK_URL));
});

router.get(apipath + 'fitbit/callback', function(req, res) {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, config.CALLBACK_URL).then(function(result) {
        // use the access token to fetch the user's profile information
        req.session.authorized = true;
        req.session.access_token = result.access_token;
        req.session.save();
        res.redirect("/");
    }).catch(function(error) {
        res.send(error);
    });
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



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.json({
        error: 'Not logged In'
    });
    res.redirect('/#/login');
}

module.exports = router;

//ADD THIS
var promise = require('bluebird');

var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = config.database;
var db = pgp(connectionString);

function addDeviceInfo(data) {
    console.log('RESULT: ' + data);
    db.none('INSERT INTO deviceinfo_tbl(data) VALUES ($1)', [data])
        .then(function() {
            console.log("Added");
        })
        .catch(function(err) {
            console.log(err);
        });
}
