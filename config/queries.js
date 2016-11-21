var promise = require('bluebird');

var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL;
var db = pgp(connectionString);

module.exports = {
    getAllUsers: getAllUsers,
    getSingleUser: getSingleUser,
    getTeamMembers: getTeamMembers,
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

    db.none('INSERT INTO person_team_tbl (person_id, team_id, isCoach) ' +
            'VALUES (${person_id}, ${team_id}, false)',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted into person_team'
                });
        })
        .catch(function(err) {
            return next(err);
        })
}

//Turn this into a transaction with batch
function createShoe(req, res, next) {
    db.task(function(t) {
            return t.one('INSERT INTO shoe_tbl (shoename, maxMileage, currentMileage, purchaseDate, isRetired, currentShoe)' +
                    'VALUES (${shoename}, ${maxmileage}, 0, ${purchasedate}, FALSE, ${currentshoe}) returning shoe_id',
                    req.body.shoeData)
                .then(function(shoe) {
                    return t.none('INSERT INTO person_shoe_tbl (person_id, shoe_id)' +
                        'VALUES ($1, $2)', [req.body.userData.person_id, shoe.shoe_id]);
                });
        })
        .then(function(events) {
            res.status(200)
                .json({
                    status: 'success',
                    events: events,
                    message: 'Inserted one shoe'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function createPR(req, res, next) {
    db.task(function(t) {
            return t.one('INSERT INTO personalrecord_tbl (prtime, prevent, prdate)' +
                    'VALUES (${prtime}, ${prevent}, ${prdate}) returning pr_id',
                    req.body.prData)
                .then(function(pr) {
                    return t.none('INSERT INTO person_pr_tbl (person_id, pr_id)' +
                        'VALUES ($1, $2)', [req.body.userData.person_id, pr.pr_id]);
                });
        })
        .then(function(events) {
            res.status(200)
                .json({
                    success: 'success',
                    events: events,
                    message: 'Inserted one PR'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function createLog(req, res, next) {
    db.task(function(t) {
            return t.one('INSERT INTO log_tbl (logtitle, activity_id, logdate, distance, activitytime, sleep, heartrate, description)' +
                    'VALUES (${logtitle}, ${activity_id}, ${logdate}, ${distance}, ${activitytime}, ${sleep}, ${heartrate}, ${description}) returning log_id',
                    req.body.logData)
                .then(function(log) {
                    return t.none('INSERT INTO person_log_tbl (person_id, log_id)' +
                        'VALUES ($1, $2)', [req.body.userData.person_id, log.log_id]);
                });
        })
        .then(function(events) {
            res.status(200)
                .json({
                    success: 'success',
                    events: events,
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
  console.log('Heres!');
  console.log(req.body);
    db.none('UPDATE person_tbl SET firstname = ${firstname}, lastname = ${lastname}, email=${email}, ispublic=${ispublic} WHERE person_id=${person_id}',
    req.body)
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    data: req.body,
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
