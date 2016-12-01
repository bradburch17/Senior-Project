var promise = require('bluebird');
var bcrypt = require('bcrypt-node');
var salt = bcrypt.genSaltSync(10);
var helper = require('../routes/routehelper');

var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL;
var db = pgp(connectionString);

module.exports = {
    updateUser: updateUser,
    updateLog: updateLog,
    updateShoe: updateShoe,
    updatePR: updatePR,
    updateTeam: updateTeam,
    updatePassword: updatePassword,
    updateComment: updateComment,
};

//Update Methods
function updateUser(req, res, next) {
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

function updateLog(req, res, next) {
    db.none('UPDATE log_tbl SET activity_id = ${activity_id}, logdate = ${logdate}, distance = ${distance}, activitytime = ${activitytime}, sleep = ${sleep}, ' +
            'heartrate = ${heartrate}, logtitle = ${logtitle}, description = ${description}, shoe_id = ${shoe_id} WHERE log_id = ${log_id}',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    data: req.body,
                    message: 'Updated log'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function updateShoe(req, res, next) {
    db.none('UPDATE shoe_tbl SET shoename = ${shoename}, maxmileage = ${maxmileage}, purchasedate = ${purchasedate}, currentshoe = ${currentshoe} WHERE shoe_id=${shoe_id}',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    data: req.body,
                    message: 'Updated shoe'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function updatePR(req, res, next) {
    db.none('UPDATE personalrecord_tbl SET prtime = ${prtime}, prevent = ${prevent}, prdate = ${prdate} WHERE pr_id=${pr_id}',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    data: req.body,
                    message: 'Updated PR'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function updateTeam(req, res, next) {
    db.none('UPDATE team_tbl SET teamname = ${teamname}, teamdescription = ${teamdescription}, isrestricted = ${isrestricted} WHERE team_id = ${team_id}',
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

function updatePassword(req, res, next) {
    var username = helper.decrypt(req.params.token);
    var hashedPassword = bcrypt.hashSync(req.body.password, salt);
    db.none('UPDATE person_tbl SET password = $1 WHERE username = $2', [hashedPassword, username])
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    data: req.body,
                    message: 'Updated password'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function updateComment(req, res, next) {
    db.none('UPDATE comment_tbl SET description = ${description} WHERE comment_id = ${comment_id}',
            req.body)
        .then(function() {
            res.status(200)
                .json({
                    status: 'success',
                    data: req.body,
                    message: 'Updated comment'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}
