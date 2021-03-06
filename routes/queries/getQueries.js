/*
  Queries for retrieving Activities, ActivitiesandShoes, All Teams, User, Team Members, User Logs, User PRs,
  User Shoes, and User Teams.

  Created by bburch
*/
var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL;
var db = pgp(connectionString);

module.exports = {
    getActivities: getActivities,
    getActivitiesandShoes: getActivitiesandShoes,
    getAllTeams: getAllTeams,
    getSingleUser: getSingleUser,
    getTeamMembers: getTeamMembers,
    getUserLogs: getUserLogs,
    getUserPRs: getUserPRs,
    getUserShoes: getUserShoes,
    getUserTeams: getUserTeams,
};

// Read Functions
function getActivities(req, res, next) {
    db.any('SELECT * FROM activity_tbl')
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved activities'
                });
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
}

function getActivitiesandShoes(req, res, next) {
    db.tx(function(t) {
            return t.batch([
                t.any('SELECT * FROM activity_tbl'),
                t.any('SELECT s.* FROM shoe_tbl s ' +
                    'INNER JOIN person_tbl p ON p.person_id = s.person_id ' +
                    'WHERE s.isretired = false AND s.person_id = $1', [req.params.id])
            ]);
        })
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    activities: data[0],
                    shoes: data[1],
                    message: 'Retrieved activities and shoes'
                });
        })
        .catch(function(error) {
            console.log("ERROR:", error.message || error);
        });
}

function getAllTeams(req, res, next) {
    db.any('SELECT * FROM team_tbl')
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
    db.one('SELECT p.username, p.sex, p.birthdate, p.firstname, p.lastname, json_agg(json_build_object(\'team\', t.*)) as teams, ' +
            'json_agg(json_build_object(\'shoe\', s.*)) as shoes, json_agg(json_build_object(\'pr\', pr.*)) as prs, d.devicename FROM person_tbl p ' +
            'LEFT JOIN person_team_tbl tp ON tp.person_id = p.person_id ' +
            'LEFT JOIN team_tbl t ON tp.team_id = t.team_id ' +
            'LEFT JOIN shoe_tbl s on s.person_id = p.person_id ' +
            'LEFT JOIN personalrecord_tbl pr on pr.person_id = p.person_id ' +
            'LEFT JOIN deviceinfo_tbl d on d.person_id = p.person_id ' +
            'WHERE p.person_id = $1 ' +
            'GROUP BY p.username, p.sex, p.birthdate, p.firstname, p.lastname, d.devicename', [req.params.id])
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
    db.any('SELECT p.username, t.teamname, json_agg(json_build_object(\'log\', l.*, \'comments\', c.*, \'activity\', a.activity)) as logs ' +
            'FROM person_tbl p ' +
            'INNER JOIN log_tbl l ON p.person_id = l.person_id ' +
            'INNER JOIN activity_tbl a ON l.activity_id = a.activity_id ' +
            'INNER JOIN person_team_tbl pt ON p.person_id = pt.person_id ' +
            'LEFT JOIN comment_tbl c ON c.log_id = l.log_id AND c.person_id = p.person_id ' +
            'INNER JOIN team_tbl t ON t.team_id = pt.team_id ' +
            'WHERE t.team_id = $1 ' +
            'AND l.logdate > NOW()::date - 7 ' +
            'GROUP BY p.username, t.teamname ' +
            'ORDER BY p.username', [req.params.id])
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

function getUserLogs(req, res, next) {
    db.any('SELECT l.*, a.activity FROM log_tbl l ' +
            'INNER JOIN activity_tbl a ON l.activity_id = a.activity_id ' +
            'WHERE l.person_id = $1', [req.params.id])
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved logs'
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
