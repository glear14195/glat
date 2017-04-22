var sendotp = require('./sendotp');
var login = require('./login');
var viewContacts = require('./contactsView');
var groupListView=require('./groupListView');
var updateProfile=require('./updateProfile');

var user = {
    'sendotp': sendotp,
    'login': login,
    'viewContacts': viewContacts,
    'groupListView':groupListView,
    'updateProfile':updateProfile
};
module.exports = user;