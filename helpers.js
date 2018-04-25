// var crypto = require('crypto');
// var algorithm = 'aes-256-ctr';
// var password = process.env.ENCRYPT_KEY;

var encrypt = function (text) {
    // var cipher = crypto.createCipher(algorithm,password)
    // var encrypted = cipher.update(text,'utf8','hex')
    // encrypted += cipher.final('hex');    
    // console.log('encrypted: %s', encrypted);
    return text;
}

var decrypt = function(text) {
    // var decipher = crypto.createDecipher(algorithm,password)
    // var decrypted = decipher.update(text,'hex','utf8')
    // decrypted += decipher.final('utf8');   
    // console.log('decrypted: %s', decrypted);
    return text;
}

var isAuthenticated = function (req, res) {
    if(req.session.encryptUid) {
      console.log("user logged in\n");
      return true;
    } else {
      console.log("user logged out");
      return false;
    }
}
  
var compare = function (a,b) { 
  if (a.name < b.name) 
    return -1;
  if (a.name > b.name) 
    return 1; 
  return 0; 
} 

exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.compare = compare;
exports.isAuthenticated = isAuthenticated;