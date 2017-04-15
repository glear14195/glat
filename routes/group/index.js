var updateOrCreate = require('./updateOrCreate');
var addMessage = require('./addMessage');

var group = {
    'updateOrCreate': updateOrCreate,
    'addMessage': addMessage
}

module.exports = group;