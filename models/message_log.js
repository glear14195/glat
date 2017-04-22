"use strict";
var schema = require('./schema');

var message_log = schema.define('message_log', {
  id: {type: schema.Number},
  gid: {type: schema.Number},
  uid: {type: schema.String, limit: 20},
  mid: {type: schema.Number},
  status: {type: schema.Number},
  modified_at: {type: schema.Date, default: Date.now}
  
});

module.exports = message_log;

//-----------------------------------------

if (require.main === module) {
  (function () {
    message_log.all({}, function(err,res) {
      console.log(err || res);
    });
  })();
}
