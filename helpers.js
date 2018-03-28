var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = process.env.SECRET_KEY;

var encrypt = function (text) {
    var cipher = crypto.createCipher(algorithm,password)
    var encrypted = cipher.update(text,'utf8','hex')
    encrypted += cipher.final('hex');    
    console.log('encrypted: %s', encrypted);
    return encrypted;
}


var decrypt = function(text) {
    var decipher = crypto.createDecipher(algorithm,password)
    var decrypted = decipher.update(text,'hex','utf8')
    decrypted += decipher.final('utf8');   
    console.log('decrypted: %s', decrypted);
    return decrypted;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;