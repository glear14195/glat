var updateOrCreate = require('./updateOrCreate');
var addMessage = require('./addMessage');
var showMessage= require('./showMessage');
var showAllMessages=require('./showAllMessages');
var markMessageRead=require('./markMessageRead');
var addMessageFeed=require('./addMessageFeed');
var displayMessageFeed=require('./displayMessageFeed');

var group = {
    'updateOrCreate': updateOrCreate,
    'addMessage': addMessage,
    'showMessage' : showMessage,
    'showAllMessages' : showAllMessages,
    'markMessageRead' : markMessageRead,
    'addMessageFeed' : addMessageFeed,
    'displayMessageFeed' : displayMessageFeed
}

module.exports = group;