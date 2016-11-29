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
    getUserPRs: getUserPRs,
    getUserShoes: getUserShoes,
    getUserTeams: getUserTeams,
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
    var userID = req.params.id;
    console.log(req.params);
    db.one('SELECT p.username, p.sex, p.birthdate, p.firstname, p.lastname, json_agg(json_build_object(\'team\', t.*)) as teams, ' +
            'json_agg(json_build_object(\'shoe\', s.*)) as shoes, json_agg(json_build_object(\'pr\', pr.*)) as prs, d.devicename FROM person_tbl p ' +
            'LEFT JOIN person_team_tbl tp ON tp.person_id = p.person_id ' +
            'LEFT JOIN team_tbl t ON tp.team_id = t.team_id ' +
            'LEFT JOIN shoe_tbl s on s.person_id = p.person_id ' +
            'LEFT JOIN personalrecord_tbl pr on pr.person_id = p.person_id ' +
            'LEFT JOIN deviceinfo_tbl d on d.person_id = p.person_id ' +
            'WHERE p.person_id = $1 ' +
            'GROUP BY p.username, p.sex, p.birthdate, p.firstname, p.lastname, d.devicename', [userID])
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

function getUserTeams(req, res, next) {
    console.log(req.params.id);
    db.one('SELECT p.username, json_agg(json_build_object(\'team\', t.*)) as teams ' +
            'FROM person_tbl p ' +
            'INNER JOIN person_team_tbl pt ON pt.person_id = p.person_id ' +
            'INNER JOIN team_tbl t ON pt.team_id = t.team_id ' +
            'WHERE p.person_id = $1' +
            'GROUP BY p.username ' +
            'ORDER BY p.username', [req.params.id])
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved all teams'
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

function getUserPRs(req, res, next) {
    db.any('SELECT pr.* FROM personalrecord_tbl pr ' +
            'INNER JOIN person_tbl p ON p.person_id = pr.person_id ' +
            'WHERE p.person_id = $1', [req.params.id])
        .then(function(data) {
            console.log(data);
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved PRs'
                });
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
}

function getUserShoes(req, res, next) {
    db.any('SELECT * FROM shoe_tbl s ' +
            'INNER JOIN person_tbl p ON p.person_id = s.person_id ' +
            'WHERE s.isretired = false AND s.person_id = $1', [req.params.id])
        .then(function(data) {
            console.log(data);
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved shoes'
                });
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
}

//Create Methods
function createTeam(req, res, next) {
    db.task(function(t) {
            console.log(req.body);
            return t.one('INSERT INTO team_tbl (teamName, teamDescription, isRestricted)' +
                    'VALUES (${teamName}, ${teamDescription}, ${isrestricted}) returning team_id',
                    req.body.teamData)
                .then(function(team) {
                    return t.none('INSERT INTO person_team_tbl (person_id, team_id, isCoach)' +
                        'VALUES ($1, $2, $3)', [req.body.userData.person_id, team.team_id, true]);
                });
        })
        .then(function(events) {
            res.status(200)
                .json({
                    status: 'success',
                    events: events,
                    message: 'Inserted one team'
                });
        })
        .catch(function(err) {
            return next(err);
        });
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
    var newMileage;
    db.task(function(t) {
            return t.none('INSERT INTO log_tbl (logtitle, activity_id, shoe_id, logdate, distance, activitytime, sleep, heartrate, description, person_id)' +
                    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [req.body.logData.logtitle, req.body.logData.activity_id, req.body.logData.shoe.shoe_id, req.body.logData.logdate,
                        req.body.logData.distance, req.body.logData.activitytime, req.body.logData.sleep, req.body.logData.heartrate, req.body.logData.description, req.body.userData.person_id
                    ])
                .then(function() {
                    return t.one('SELECT currentmileage FROM shoe_tbl WHERE shoe_id = $1', [req.body.logData.shoe.shoe_id]);
                })
                .then(function(mileage) {
                    newMileage = parseInt(req.body.logData.distance) + parseInt(mileage.currentmileage);
                    return t.none('UPDATE shoe_tbl SET currentmileage = $1 WHERE shoe_id = $2', [newMileage, req.body.logData.shoe.shoe_id]);
                });
        })
        .then(function(events) {
            res.status(200)
                .json({
                    status: 'success',
                    events: events,
                    message: 'Inserted one team'
                });
        })
        .catch(function(error) {
            console.log("ERROR:", error.message || error);
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
