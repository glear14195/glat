var sendotp = require('./sendotp')
var login = require('./login')
var user ={
    'sendotp' : sendotp,
    'login' : login
};
module.exports = user;