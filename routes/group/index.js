var updateOrCreate = require('./updateOrCreate');
var addMessage = require('./addMessage');
var showMessage= require('./showMessage');

var group = {
    'updateOrCreate': updateOrCreate,
    'addMessage': addMessage,
    'showMessage' : showMessage
}

module.exports = group;