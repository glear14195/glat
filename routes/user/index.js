var signup = require('./signup')
var otpver = require('./otpverified')
var user ={
    'signup' : signup,
    'otpverified' : otpver
};
module.exports = user;