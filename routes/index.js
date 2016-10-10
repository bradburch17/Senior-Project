var express = require('express');
var router = express.Router();

var db = require('../queries');
var apipath = '/api/v1/';
const path = require('path');

router.get('/', (req, res, next) =>
{
  res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
});

router.get(apipath + 'users', db.getAllUsers);
router.get(apipath + 'users/:id', db.getSingleUser);
router.post(apipath + 'users', db.createUser);
router.post(apipath + 'teams', db.createTeam);
router.put(apipath + 'users/:id', db.updateUser);
router.delete(apipath + 'users/:id', db.removeUser);


module.exports = router;
