"use strict";

var MessageLog = require('../../models/message_log');

var markMessageRead = function (req, res) {
  var resp = { 'status': 'fail', 'err': '', 'resp': {} };

  var gid = req.data.gid || '';
  var phone = req.data.phone || '';
  var mid = req.data.mid || '';

  if (gid && uid && mid) {
    var whereDict = {
      status: 0,
      gid: gid,
      uid: phone,
      mid: mid
    };
    var updateDict = {
      status: 1,
      modified_time: Date.now
    };

    MessageLog.update({ where: whereDict }, updateDict, function (err, result) {
      if (!err) {
        resp.status = 'success';
        resp.resp = 'Message in Read status';
      } else {
        console.log(`[ERROR user/markMessageRead] for ${phone}: ${err}`);
        resp.err = err;
      }
      res.json(resp);
    });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR user/markMessageRead] Invalid parameters for ${phone}`)
    res.json(resp);
  }
};

module.exports = markMessageRead
