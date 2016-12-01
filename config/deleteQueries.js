var promise = require('bluebird');

var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL;
var db = pgp(connectionString);

module.exports = {
    removeUser: removeUser,
    removeShoe: removeShoe,
    removePR: removePR,
    removeLog: removeLog,
};

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

function removeShoe(req, res, next) {
    db.result('DELETE FROM shoe_tbl WHERE shoe_id = $1', [req.params.id])
        .then(function(result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} shoe`
                });
        })
        .catch(function(err) {
            res.status(304)
                .json({
                    status: 'error',
                    error: err,
                    message: 'Error'
                });
            return next(err);
        });
}

function removePR(req, res, next) {
    db.result('DELETE FROM personalrecord_tbl WHERE pr_id = $1', [req.params.id])
        .then(function(result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} shoe`
                });
        })
        .catch(function(err) {
            res.status(304)
                .json({
                    status: 'error',
                    error: err,
                    message: 'Error'
                });
            return next(err);
        });
}

function removeLog(req, res, next) {
    db.result('DELETE FROM log_tbl WHERE log_id = $1', [req.params.id])
        .then(function(result) {
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} log`
                });
        })
        .catch(function(err) {
            res.status(304)
                .json({
                    status: 'error',
                    error: err,
                    message: 'Error'
                });
            return next(err);
        });
}
