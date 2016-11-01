var express = require('express');
var passport = require('passport');
var router = express.Router();

var db = require('../queries');
var config = require('../config/config');
var apipath = '/api/v1/';
const path = require('path');

var FitbitApiClient = require('fitbit-node');
var client = new FitbitApiClient(config.CLIENT_ID, config.CLIENT_SECRET);

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
});

router.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'sign-in', 'partial-signin.html'));
});

router.get(apipath + 'users', isLoggedIn, db.getAllUsers);
router.get(apipath + 'users/:id', isLoggedIn, db.getSingleUser);
router.get(apipath + 'team', db.getTeamMembers)
router.post(apipath + 'users', isLoggedIn, db.createUser);
router.post(apipath + 'teams', db.createTeam);
router.post(apipath + 'shoes', isLoggedIn, db.createShoe);
router.post(apipath + 'prs', isLoggedIn, db.createPR);
router.post(apipath + 'logs', isLoggedIn, db.createLog);
router.put(apipath + 'users/:id', isLoggedIn, db.updateUser);
router.delete(apipath + 'users/:id', isLoggedIn, db.removeUser);

router.post(apipath + 'register', passport.authenticate('local-signup'), function(req, res, err) {
    res.json(req.user);
});

router.post(apipath + 'login', passport.authenticate('local-login'), function(req, res, err) {
    res.json(req.user);
});

router.get(apipath + 'auth', function(req, res) {
    if (req.isAuthenticated())
        return res.status(200).json({
            status: true
        });

    res.status(200).json({
        status: false
    });
});

router.get(apipath + 'logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Logged out!'
    });
});

router.get(apipath + 'fitbit', function (req, res) {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', config.CALLBACK_URL));
});

router.get(apipath + 'fitbit/callback', function (req, res) {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, config.CALLBACK_URL).then(function (result) {
        // use the access token to fetch the user's profile information
        req.session.authorized = true;
        req.session.access_token = result.access_token;
        req.session.save();
        console.log('Here');
        res.redirect("/");
    }).catch(function (error) {
        res.send(error);
    });
});

router.get('/profile.json', function(req, res) {
    if (req.session.authorized) {
        client.get("/profile.json", req.session.access_token).then(function(results) {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/#/login');
}

module.exports = router;
