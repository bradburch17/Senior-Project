var promise = require('bluebird');

var options = {
    promiseLib: promise
};
var config = require('./config/config');
var pgp = require('pg-promise')(options);
var connectionString = config.database;
var db = pgp(connectionString);

// add query functions

module.exports = {
    getAllUsers: getAllUsers,
    getSingleUser: getSingleUser,
    getTeamMembers: getTeamMembers,
    createUser: createUser,
    createTeam: createTeam,
    createShoe: createShoe,
    createPR: createPR,
    createLog: createLog,
    createDeviceInfo: createDeviceInfo,
    updateUser: updateUser,
    removeUser: removeUser,
    addDeviceInfo: addDeviceInfo
};

// Read Functions
function getAllUsers(req, res, next) {
    db.any('SELECT * FROM person_tbl')
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL users'
                });
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
}

function getSingleUser(req, res, next) {
    var userID = parseInt(req.params.id);
    db.one('SELECT * FROM person_tbl WHERE person_id=$1', userID)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ONE user'
                });
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
}

function getTeamMembers(req, res, next) {
    db.any('SELECT p.username, json_agg(json_build_object(\'log\', l.*, \'activity\', a.activity)) as logs ' +
            'FROM person_log_tbl pl ' +
            'INNER JOIN person_tbl p ON pl.person_id = p.person_id ' +
            'INNER JOIN log_tbl l ON pl.log_id = l.log_id ' +
            'INNER JOIN activity_tbl a ON l.activity_id = a.activity_id ' +
            'GROUP BY p.username ' +
            'ORDER BY p.username')
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved team members'
                });
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
}

//Create Methods
function createUser(req, res, next) {
    db.none('INSERT INTO person_tbl (username, password, email, sex, firstname, lastname, ispublic, iscoach, birthdate)' +
            'VALUES (${username}, ${password}, ${email}, ${sex}, ${firstname}, ${lastname}, false, false, ${birthdate})',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted one person'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function createTeam(req, res, next) {
    db.none('INSERT INTO team_tbl (coach_id, teamName, teamDescription, isRestricted)' +
            'VALUES (${coach_id}, ${teamName}, ${teamDescription}, ${isRestricted})',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted one team'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function createShoe(req, res, next) {
    db.none('INSERT INTO shoe_tbl (shoename, maxMileage, currentMileage, purchaseDate, isRetired, currentShoe)' +
            'VALUES (${shoename}, ${maxmileage}, 0, ${purchasedate}, FALSE, ${currentshoe})',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted one shoe'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function createPR(req, res, next) {
    db.none('INSERT INTO personalrecord_tbl (prtime, prevent, prdate)' +
            'VALUES (${prtime}, ${prevent}, ${prdate})',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    success: 'success',
                    message: 'Inserted one PR'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function createLog(req, res, next) {
    db.none('INSERT INTO log_tbl (activity_id, logdate, distance, activitytime, sleep, heartrate, description)' +
            'VALUES (${activity_id}, ${logdate}, ${distance}, ${activitytime}, ${sleep}, ${heartrate}, ${description})',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    success: 'success',
                    message: 'Inserted one log'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function createDeviceInfo(data, req, res, next) {
    db.none('INSERT INTO deviceinfo_tbl(deviceName, data) VALUES (${devicename}, ${data})', req.body, data)
        .then(function() {
            res.status(200)
                .json({
                    success: 'success',
                    message: 'Inserted device info'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function addDeviceInfo(req, res, next) {
    db.none('INSERT INTO deviceinfo_tbl(data) VALUES (${data})', res.jsondata)
        .then(function() {
            console.log("Added!");
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
}

//Update Methods
function updateUser(req, res, next) {
    db.none('UPDATE person_tbl SET shoe_id=$2, team_id=$3, device_id=$4, pr_id=$5, username=$6, password=$7, email=$8, sex=$9, ispublic=$10, iscoach=$11, birthdate=$12 WHERE person_id=$13', [parseInt(req.body.shoe_id), parseInt(req.body.team_id), parseInt(req.body.device_id), req.body.username, req.body.password, req.body.email, req.body.sex, req.body.ispublic /*May need fixed*/ , req.body.iscoach, req.body.birthdate, parseInt(req.params.person_id)])
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated user'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

//Delete Methods
function removeUser(req, res, next) {
    var userID = parseInt(req.params.id);
    db.result('DELETE FROM person_tbl WHERE person_id=$1', userID)
        .then(function(result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} user`
                });
        })
        .catch(function(err) {
            return next(err);
        });
}
