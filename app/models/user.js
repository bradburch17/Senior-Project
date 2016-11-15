var pg = require('pg');
var config = require('../../config/config');
var conString = config.database;

var client = new pg.Client(conString);
var bcrypt = require('bcrypt-node');
var salt = bcrypt.genSaltSync(10);

function User() {
    this.person_id = "";
    this.firstname = ""
    this.lastname = "";
    this.birthdate = "";
    this.sex = "";
    this.email = "";
    this.ispublic = false;
    this.username = "";
    this.password = ""; //need to declare the things that i want to be remembered for each user in the database
    this.token = ""; //I think I need to declare this in order to return it. Currently not in use

    this.save = function(callback) {
        client.connect();
        var hashedPassword = bcrypt.hashSync(this.password, salt);

        client.query('INSERT INTO person_tbl (username, password, email, sex, firstname, lastname, ispublic, birthdate)' +
            'VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [this.username, hashedPassword, this.email, this.sex, this.firstname, this.lastname, this.ispublic, this.birthdate],
            function(err, result) {
                if (err) {
                    console.log(err);
                    return console.error('error running query', err);
                }
                if (result.rows.length > 0) {
                    this.person_id = result.row[0]['person_id'];
                    client.end();
                }
                console.log(result.rows);
            });

        client.query('SELECT * FROM person_tbl ORDER BY person_id DESC LIMIT 1', null, function(err, result) {

            if (err) {
                return callback(null);
            }
            //if no rows were returned from query, then new user
            if (result.rows.length > 0) {
                console.log(result.rows[0] + ' is found! in the select all');
                var user = new User();
                user.email = result.rows[0]['email'];
                user.password = result.rows[0]['password'];
                user.person_id = result.rows[0]['person_id'];
                user.firstname = result.rows[0]['firstname'];
                user.lastname = result.rows[0]['lastname'];
                user.birthdate = result.rows[0]['birthdate'];
                user.sex = result.rows[0]['sex'];
                user.ispublic = result.rows[0]['ispublic'];
                user.username = result.rows[0]['username'];
                client.end();
                return callback(user);
            }
        });
    };
}

User.findOne = function(username, callback) {
    var client = new pg.Client(conString);
    var user = new User();
    var isNotAvailable = false; //we are assuming the email is taking
    console.log(username + ' is in the findOne function in User.js');
    //check if there is a user available for this email;
    client.connect();

    client.query("SELECT * from person_tbl where username=$1", [username], function(err, result) {
        if (err) {
            console.log('Error: ' + err);
            return callback(err, isNotAvailable, this);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0) {
            var user = new User();
            isNotAvailable = true; // update the user for return in callback
            user.username = username;
            user.password = result.rows[0].password;
            console.log(username + ' was found');
        } else {
            isNotAvailable = false;
            username = username;
            console.log(username + ' was not found');
        }

        client.end();
        return callback(false, isNotAvailable, this);
    });
};

User.findByUsername = function(username, callback) {
    var client = new pg.Client(conString);
    var user = new User();
    var isNotAvailable = false; //we are assuming the email is taking
    console.log(username + ' is in the findOne function in User.js');
    //check if there is a user available for this email;
    client.connect();

    client.query("SELECT * from person_tbl where username=$1", [username], function(err, result) {
        if (err) {
            console.log('Error: ' + err);
            return callback(err, isNotAvailable, this);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0) {
            var user = new User();
            user.email = result.rows[0]['email'];
            user.password = result.rows[0]['password'];
            user.person_id = result.rows[0]['person_id'];
            user.firstname = result.rows[0]['firstname'];
            user.lastname = result.rows[0]['lastname'];
            user.birthdate = result.rows[0]['birthdate'];
            user.sex = result.rows[0]['sex'];
            user.device_id = result.rows[0]['device_id'];
            user.ispublic = result.rows[0]['ispublic'];
            user.username = username;
            console.log(username + ' was found');
        } else {
            isNotAvailable = false;
            username = username;
            console.log(username + ' was not found');
        }

        client.end();
        return callback(null, user);
    });
};

User.findById = function(id, callback) {
    console.log("We are in findbyid " + id);
    var client = new pg.Client(conString);

    client.connect();
    client.query("SELECT * from person_tbl where person_id=$1", [id], function(err, result) {

        if (err) {
            return callback(err, null);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0) {
            console.log(result.rows[0] + ' is found!');
            var user = new User();
            user.email = result.rows[0]['email'];
            user.password = result.rows[0]['password'];
            user.person_id = result.rows[0]['person_id'];
            user.firstname = result.rows[0]['firstname'];
            user.lastname = result.rows[0]['lastname'];
            user.birthdate = result.rows[0]['birthdate'];
            user.sex = result.rows[0]['sex'];
            user.ispublic = result.rows[0]['ispublic'];
            user.username = result.rows[0]['username'];
            console.log(user.email);
            return callback(null, user);
        }
    });
};

module.exports = User;
