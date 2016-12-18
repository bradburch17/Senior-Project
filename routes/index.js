/*
  All API routes for the app. Almost all functions stored in helpers.

  Created by bburch
*/
var express = require('express');
var router = express.Router();
var passport = require('passport');
const path = require('path');
var apipath = '/api/v1/'; //Default API path

//All the query helpers for API backend
var get = require('./queries/getQueries');
var create = require('./queries/createQueries');
var update = require('./queries/updateQueries');
var remove = require('./queries/deleteQueries');

var routeHelper = require('./helpers/routehelper'); //General helper
var fitbitHelper = require('./helpers/fitbitHelper'); //Fitbit API helper

//Loads the single page index.html into the application
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
});

//GET API requests for Activities, Logs, Logout, Teams, Users, Fitbit
router.get(apipath + 'activities', get.getActivities);
router.get(apipath + 'logs/info/:id', get.getActivitiesandShoes);
router.get(apipath + 'logout', routeHelper.logout);
router.get(apipath + 'teams', get.getAllTeams);
router.get(apipath + 'team/:id', get.getTeamMembers);
router.get(apipath + 'user/:id', get.getSingleUser);
router.get(apipath + 'user/:id/teams', get.getUserTeams);
router.get(apipath + 'user/:id/shoes', get.getUserShoes);
router.get(apipath + 'user/:id/logs', get.getUserLogs);
router.get(apipath + 'user/:id/prs', get.getUserPRs);
router.get(apipath + 'fitbit', fitbitHelper.getAuthURL);
router.get(apipath + 'fitbit/activity/:date', fitbitHelper.activityDate);
router.get(apipath + 'fitbit/activity/today', fitbitHelper.activityToday);
router.get(apipath + 'fitbit/auth', fitbitHelper.getAuthentication);
router.get(apipath + 'fitbit/callback', fitbitHelper.callback);
router.get(apipath + 'fitbit/heartrate', fitbitHelper.heartrateToday);
router.get(apipath + 'fitbit/profile.json', fitbitHelper.profile);
router.get(apipath + 'fitbit/sleep/today', fitbitHelper.sleepToday);
router.get(apipath + 'fitbit/sleep/:date', fitbitHelper.sleepDate);

//POST API requests for Forgotpass, Login, Logs, Comments, PRs, Registration, Shoes, Teams
router.post(apipath + 'forgotpass', routeHelper.forgotPass);
router.post(apipath + 'login', passport.authenticate('local-login'), function(req, res, err) {
    res.json(req.user);
});
router.post(apipath + 'logs', create.createLog);
router.post(apipath + 'log/comment/:id', create.createComment);
router.post(apipath + 'prs', create.createPR);
router.post(apipath + 'register', passport.authenticate('local-signup'), function(req, res, err) {
    res.json(req.user);
});
router.post(apipath + 'shoes', create.createShoe);
router.post(apipath + 'team', create.createTeam);
router.post(apipath + 'team/join/:id', create.joinTeam);

//PUT API requests for Logs, Password change, PRs, Shoes, Team, Users
router.put(apipath + 'logs/:id', update.updateLog);
router.put(apipath + 'logs/comment/:id', update.updateComment);
router.put(apipath + 'passwordchange/:token', update.updatePassword);
router.put(apipath + 'prs/:id', update.updatePR);
router.put(apipath + 'shoes/:id', update.updateShoe);
router.put(apipath + 'team/:id', update.updateTeam);
router.put(apipath + 'users/:id', update.updateUser);

//DELETE API requests for Logs, PRs, Shoes, Users
router.delete(apipath + 'logs/:id', remove.removeLog);
router.delete(apipath + 'pr/:id', remove.removePR);
router.delete(apipath + 'shoe/:id', remove.removeShoe);
router.delete(apipath + 'users/:id', remove.removeUser);

module.exports = router;
