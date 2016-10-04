var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:s@localhost:5432/JoggersLoggersDB';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllUsers: getAllUsers,
  getSingleUser: getSingleUser,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
};

function getAllUsers(req, res, next) {
  db.any('SELECT * FROM person_tbl')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL users'
        });
      console.log("success");
    })
    .catch(function (err) {
      console.log(err);
      return next(err);
    });
}

function getSingleUser(req, res, next) {
  var userID = parseInt(req.params.id);
  db.one('SELECT * FROM person_tbl WHERE person_id=$1', userID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE user'
        });
    })
    .catch(function (err) {
      console.log(err);
      return next(err);
    });
}

//CREATE A USER
function createUser(req, res, next) {
  db.none('INSERT INTO person_tbl(person_id, shoe_id, team_id, device_id, pr_id, username, password, email, sex, isPublic, isCoach, birthdate)' +
      'values(${person_id}, ${shoe_id}, ${device_id}, ${pr_id}, ${username}, ${password}, ${email}, ${sex}, ${isPublic}, ${isCoach}, ${birthdate})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one user'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

//CREATE A TEAM
function createTeam(req, res, next) {
  db.none('INSERT INTO team_tbl(team_id, coach_id, teamName, teamDescription, isRestricted)' +
      'values(${team_id}, ${coach_id}, ${teamName}, ${teamDescription}, ${isRestricted})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one team'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateUser(req, res, next) {
  db.none('UPDATE person_tbl SET shoe_id=$2, team_id=$3, device_id=$4, pr_id=$5, username=$6, password=$7, email=$8, sex=$9, ispublic=$10, iscoach=$11, birthdate=$12 WHERE person_id=$13',
    [parseInt(req.body.shoe_id), parseInt(req.body.team_id), parseInt(req.body.device_id), req.body.username, req.body.password, req.body.email, req.body.sex, req.body.ispublic /*May need fixed*/, req.body.iscoach, req.body.birthdate, parseInt(req.params.person_id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated user'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeUser(req, res, next) {
  var userID = parseInt(req.params.id);
  db.result('DELETE FROM person_tbl WHERE person_id=$1', userID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} user`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
