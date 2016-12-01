var crypto = require('crypto'),
    algorithm = process.env.ENCRYPTION_ALGORITHM,
    password = process.env.ENCRYPTION_PASSWORD;

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}

function encrypt(username) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(username, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(username) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(username, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
