var promise = require('bluebird');

var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL;
var db = pgp(connectionString);

module.exports = {
    createTeam: createTeam,
    createShoe: createShoe,
    createPR: createPR,
    createLog: createLog,
    createActivity: createActivity,
};

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
                    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [req.body.logData.logtitle, req.body.logData.activity.activity_id, req.body.logData.shoe.shoe_id, req.body.logData.logdate,
                        req.body.logData.distance, req.body.logData.activitytime, req.body.logData.sleep, req.body.logData.heartrate, req.body.logData.description, req.body.userData.person_id
                    ])
                .then(function() {
                    if (req.body.logData.shoe.shoe_id !== null) {
                        return t.one('SELECT currentmileage FROM shoe_tbl WHERE shoe_id = $1', [req.body.logData.shoe.shoe_id]);
                    }
                })
                .then(function(mileage) {
                    if (req.body.logData.shoe.shoe_id !== null) {
                        newMileage = parseInt(req.body.logData.distance) + parseInt(mileage.currentmileage);
                        return t.none('UPDATE shoe_tbl SET currentmileage = $1 WHERE shoe_id = $2', [newMileage, req.body.logData.shoe.shoe_id]);
                    }
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
            return next(error);
        });
}

function createActivity(req, res, next) {
    db.none('INSERT INTO activity_tbl (activity) VALUES (${activity})', req.body.activityData)
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
            return next(error);
        });
}
