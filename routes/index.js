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

router.get(apipath + 'users', db.getAllUsers);
router.get(apipath + 'users/:id', db.getSingleUser);
router.post(apipath + 'users', db.createUser);
router.post(apipath + 'teams', db.createTeam);
router.post(apipath + 'shoes', db.createShoe);
router.post(apipath + 'prs', db.createPR);
router.post(apipath + 'logs', db.createLog);
router.put(apipath + 'users/:id', db.updateUser);
router.delete(apipath + 'users/:id', db.removeUser);

router.post(apipath + 'register', passport.authenticate('local-signup', {
    successRedirect: '/',
    //failureRedirect: '#/signup',
    failureFlash: true
}));

router.post(apipath + 'login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get(apipath + 'logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;
