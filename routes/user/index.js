var sendotp = require('./sendotp');
var login = require('./login');
var viewContacts = require('./contactsView');
var groupListView=require('./groupListView');

var user = {
    'sendotp': sendotp,
    'login': login,
    'viewContacts': viewContacts,
    'groupListView':groupListView
};
module.exports = user;