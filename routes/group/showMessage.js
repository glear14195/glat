"use strict";

var messageHandler = require('../../lib/message');
var butils = require('../../lib/butils');


var showMessage = function (req, res) {
  var resp = { 'status': 'fail', 'err': '', 'resp': [] };
  var phone = req.data.phone || '';
  var gid = req.data.gid || '';
  var mid = req.data.mid || '';

  if (phone && gid && mid) {
    messageHandler.getMessageSolr(gid, mid, function (err, result) {
      if (!err) {
        resp.status = 'success';
        resp.resp = result;
      } else {
        console.log(`[ERROR user/showMessage] for ${phone}: ${err}`);
        resp.err = err;
      }
      res.json(resp);
    });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR user/showMessage] Invalid parameters for ${phone}`)
    res.json(resp);
  }
};

module.exports = showMessage;
