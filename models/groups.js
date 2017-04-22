"use strict";
var schema = require('./schema');

var groups = schema.define('groups', {
  id: {type: schema.Number},
  uid: {type: schema.String, limit: 20},
  gname: {type: schema.String, limit: 40},
  is_active: {type: schema.Boolean, default: true},
  pic_location: {type: schema.String, limit: 100},
  created_at: {type: schema.Date, default: Date.now}
});

module.exports = groups;

//-----------------------------------------

if (require.main === module) {
  (function () {
    groups.all({}, function (err, res) {
      console.log(err || res);
    });
    groups.findOne({where: {uid: '121212', gname: 'lolololo'}}, function (err, result) {
      console.log(err || result);
    });
  })();
}
