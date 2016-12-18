/*
  Router helper for:
    Decrypting and Encrypting username token
    Sends email for forgotpassword
    Logs user out

  Created by bburch
*/
var crypto = require('crypto'),
    algorithm = process.env.ENCRYPTION_ALGORITHM,
    password = process.env.ENCRYPTION_PASSWORD;
var nodemailer = require('nodemailer');
var User = require('../../app/models/user');

module.exports = {
    decrypt: decrypt,
    encrypt: encrypt,
    forgotPass: forgotPass,
    logout: logout,
    sendEmail: sendEmail,
}

//Decrypt username from the email token
function decrypt(username) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(username, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

//Encrypt username for email token
function encrypt(username) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(username, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

//Creates a token (encrypted username) to email to the user
function forgotPass(req, res) {
    var token;
    User.findByEmail(req.body.email, function(err, user) {
        if (!user) {
            return res.redirect('/forgot');
        } else {
            token = encrypt(user.username);
            sendEmail(token, req.body.email);
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Sent recovery email'
                });
        }
    });
}

//Logouts user from the server
function logout(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Logged out!'
    });
}

//Sends email to user via Gmail SMPT. Sends encrypted username as token.
function sendEmail(token, email) {
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: 'joggersandloggers@gmail.com',
        to: email,
        subject: 'Joggers and Loggers Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'https://joggersandloggers.herokuapp.com/#/passwordchange/' + token + '\n\n' +
            // 'http://localhost:3000/#/passwordchange/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n' +
            'Please do not respond to this email.\n\n' +
            'Your Friends, \n' +
            'Joggers and Loggers Team \n' +
            '(aka Brad Burch)'
    };

    smtpTransport.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
        }
    });
}
