"use strict";
var schema = require('./schema');

var message_feed = schema.define('message_feed', {
  id: {type: schema.Number},
  gid: {type: schema.Number},
  uid: {type: schema.String, limit: 20},
  mid: {type: schema.Number},
  comment: {type: schema.String},
  created_at: {type: schema.Date, default: Date.now}
  
});

module.exports = message_feed;

//-----------------------------------------

if (require.main === module) {
  (function () {
    message_feed.all({}, function(err,res) {
      console.log(err || res);
    });
  })();
}
