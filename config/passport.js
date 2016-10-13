var LocalStrategy = require('passport-local').Strategy;
var pg = require('pg');
var conString = "postgres://postgres:s@localhost:5432/JoggersLoggersDB";
var bcrypt = require('bcrypt-node');
var salt = bcrypt.genSaltSync(10);
var client = new pg.Client(conString);

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log(user.person_id + " was seralized");
        done(null, user.person_id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log(id + " was deserialized");
        User.findById(id, function(err, user) {
            console.log(id + ' was used in the findbyid method');
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            emailField: 'email',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function(callback) {


                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne(email, function(err, isNotAvailable, user) {
                    //console.log('userfound: ' + isNotAvailable);
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (isNotAvailable == true) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        console.log('new local user');

                        // if there is no user with that email
                        // create the user
                        user = new User();

                        user.username = req.body.username;
                        user.password = req.body.password;
                        user.email = req.body.email;
                        user.sex = req.body.sex;
                        user.birthdate = req.body.birthdate;
                        user.firstname = req.body.firstname;
                        user.lastname = req.body.lastname;

                        user.save(function(newUser) {
                            console.log("the object user is: ", newUser);
                            passport.authenticate();
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));



    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            console.log("In Local-Login with " + username + " " + password);
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findByUsername(username, function(err, user) {
                console.log("In findByUsername with " + username + " " + password + " " + user.password);
                // if there are any errors, return the error before anything else
                if (err) {
                    console.log('Error: ' + err);
                    return done(err);
                }

                // if no user is found, return the message
                if (!user) {
                    console.log("No user found");
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user is found but the password is wrong
                console.log(user);
                console.log(user.password + " " + password);
                if (!isValidPassword(user, password)) {
                    console.log("Wrong Password");
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }
                // all is well, return successful user
                console.log('Logged In :)');
                return done(null, user);
            });
        }));

        var isValidPassword = function(user, password) {
          return bcrypt.compareSync(password, user.password);
        }
}
