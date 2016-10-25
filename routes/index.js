var express = require('express');
var passport = require('passport');
var router = express.Router();

var db = require('../queries');
var apipath = '/api/v1/';
const path = require('path');

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
});

router.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'sign-in', 'partial-signin.html'));
});

router.get(apipath + 'users',  isLoggedIn, db.getAllUsers);
router.get(apipath + 'users/:id', isLoggedIn, db.getSingleUser);
router.post(apipath + 'users', isLoggedIn, db.createUser);
router.post(apipath + 'teams', isLoggedIn, db.createTeam);
router.post(apipath + 'shoes', isLoggedIn, db.createShoe);
router.post(apipath + 'prs',  isLoggedIn, db.createPR);
router.post(apipath + 'logs', isLoggedIn, db.createLog);
router.put(apipath + 'users/:id', isLoggedIn, db.updateUser);
router.delete(apipath + 'users/:id', isLoggedIn, db.removeUser);

router.post(apipath + 'register', passport.authenticate('local-signup'), function(req, res, err) {
  res.json(req.user);
});

// router.post(apipath + 'login', passport.authenticate('local-login', {
//     successRedirect: '/',
//     failureRedirect: '/#/login',
//     failureFlash: true
// }));

router.post(apipath + 'login', passport.authenticate('local-login'), function(req, res, err) {
  res.json(req.user);
});

router.get(apipath + 'logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/#/login');
}

module.exports = router;
