var promise = require('bluebird');

var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL;
var db = pgp(connectionString);

module.exports = {
    getAllUsers: getAllUsers,
    getAllTeams: getAllTeams,
    getSingleUser: getSingleUser,
    getTeamMembers: getTeamMembers,
    getUserPRs: getUserPRs,
    getUserShoes: getUserShoes,
    getUserTeams: getUserTeams,
    getActivities: getActivities
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
    db.any('SELECT p.username, t.teamname, json_agg(json_build_object(\'log\', l.*, \'activity\', a.activity)) as logs ' +
            'FROM person_tbl p ' +
            'INNER JOIN log_tbl l ON p.person_id = l.person_id ' +
            'INNER JOIN activity_tbl a ON l.activity_id = a.activity_id ' +
            'INNER JOIN person_team_tbl pt on p.person_id = pt.person_id ' +
            'INNER JOIN team_tbl t on t.team_id = pt.team_id ' +
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

function getActivities(req, res, next) {
    db.any('SELECT * FROM activity_tbl')
        .then(function(data) {
            console.log(data);
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
