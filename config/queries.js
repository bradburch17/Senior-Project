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
            'FROM person_tbl p ' +
            'INNER JOIN log_tbl l ON p.person_id = l.person_id ' +
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
    db.none('INSERT INTO team_tbl (teamName, teamDescription, isRestricted)' +
            'VALUES (${teamName}, ${teamDescription}, ${isRestricted})',
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
    db.none('INSERT INTO shoe_tbl (shoename, maxMileage, currentMileage, purchaseDate, isRetired, currentShoe, person_id)' +
            'VALUES ($1, $2, 0, $3, FALSE, $4, $5)', [req.body.shoeData.shoename, req.body.shoeData.maxmileage, req.body.shoeData.purchasedate, req.body.shoeData.currentshoe, req.body.userData.person_id])
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
    db.none('INSERT INTO personalrecord_tbl (prtime, prevent, prdate, person_id)' +
            'VALUES ($1, $2, $3, $4)', [req.body.prData.prtime, req.body.prData.prevent, req.body.prData.prdate, req.body.userData.person_id])
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
    db.none('INSERT INTO log_tbl (logtitle, activity_id, logdate, distance, activitytime, sleep, heartrate, description, person_id)' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [req.body.logData.logtitle, req.body.logData.activity_id, req.body.logData.logdate,
                req.body.logData.distance, req.body.logData.activitytime, req.body.logData.sleep, req.body.logData.heartrate, req.body.logData.description, req.body.userData.person_id
            ])
        .then(function(events) {
            res.status(200)
                .json({
                    success: 'success',
                    events: events,
                    message: 'Inserted one log'
                });
        })
        .catch(function(err) {
            console.log('Error here');
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
