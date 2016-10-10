var promise = require('bluebird');

var options = {
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
    createTeam: createTeam,
    createShoe: createShoe,
    updateUser: updateUser,
    removeUser: removeUser
};

// Read Functions
function getAllUsers(req, res, next) {
    db.any('SELECT p.*, t.*, s.*, row_to_json(pr.*) as prs, d.*  FROM person_tbl AS p ' +
            'JOIN team_tbl AS t on p.person_id = t.person_id ' +
            'JOIN shoe_tbl AS s on p.person_id = s.person_id ' +
            'JOIN personalrecord_tbl AS pr on p.person_id = pr.person_id ' +
            'JOIN deviceinfo_tbl AS d on p.person_id = d.person_id ' +
            'WHERE p.person_id = 1 AND s.currentshoe = TRUE')
        .then(function(data) {
            res.status(200)
                .json({
                    data: data
                });
            console.log("success");
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

//Create Methods
function createUser(req, res, next) {
    db.none('INSERT INTO person_tbl(person_id, shoe_id, team_id, device_id, pr_id, username, password, email, sex, isPublic, isCoach, birthdate)' +
            'values(${person_id}, ${shoe_id}, ${device_id}, ${pr_id}, ${username}, ${password}, ${email}, ${sex}, ${isPublic}, ${isCoach}, ${birthdate})',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted one user'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function createTeam(req, res, next) {
    db.none('INSERT INTO team_tbl(team_id, coach_id, teamName, teamDescription, isRestricted)' +
            'values(${team_id}, ${coach_id}, ${teamName}, ${teamDescription}, ${isRestricted})',
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
    db.none('INSERT INTO shoe_tbl(shoe_id, shoename, maxMileage, currentMileage, purchaseDate, isRetired, currentShoe, person_id)' +
            'values(${shoe_id}, ${shoename}, ${maxMileage}, ${currentMileage}, ${purchaseDate}, ${isRetired}, ${currentShoe}, ${person_id})',
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

//Update Methods
function updateUser(req, res, next) {
    db.none('UPDATE person_tbl SET shoe_id=$2, team_id=$3, device_id=$4, pr_id=$5, username=$6, password=$7, email=$8, sex=$9, ispublic=$10, iscoach=$11, birthdate=$12 WHERE person_id=$13',
            [parseInt(req.body.shoe_id), parseInt(req.body.team_id), parseInt(req.body.device_id), req.body.username, req.body.password, req.body.email, req.body.sex, req.body.ispublic /*May need fixed*/ , req.body.iscoach, req.body.birthdate, parseInt(req.params.person_id)])
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
