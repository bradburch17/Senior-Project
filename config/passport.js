var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-node');
var salt = bcrypt.genSaltSync(10);

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.person_id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
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

                // find a user whose username is the same as the forms username
                // we are checking to see if the user trying to login already exists
                User.findOne(email, function(err, isNotAvailable, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (isNotAvailable == true) {
                        return done(null, false);
                    } else {
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
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findByUsername(username, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err) {
                    console.log('Error: ' + err);
                    return done(err);
                }

                // if no user is found, return the message
                if (!user) {
                    console.log("No user found");
                    return done(null, false);
                }
                // if the user is found but the password is wrong
                if (!isValidPassword(user, password)) {
                    console.log("Wrong Password");
                    return done(null, false);
                }
                // all is well, return successful user

                return done(null, user);
            });
        }));

    var isValidPassword = function(user, password) {
        return bcrypt.compareSync(password, user.password);
    }
}
