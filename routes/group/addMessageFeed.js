"use strict";

var MessageFeed = require('../../models/message_feed');

var addMessageFeed = function (req, res) {
  var resp = { 'status': 'fail', 'err': '', 'resp': [] };
  
  var gid = req.data.gid || '';
  var phone = req.data.phone || '';
  var mid = req.data.mid || '';
  var comment = req.data.comment || '';

  if (gid && phone && mid && comment) {
    MessageFeed.create({
        comment: comment,
        gid: gid,
        uid: phone,
        mid: mid
      }, function (err, result) {
        if (!err) {
          resp.status = 'success';
          resp.resp = 'Comment in the message feed ';
        } else {
          console.log(`[ERROR user/addMessageFeed] for ${phone}: ${err}`);
          resp.err = err;
        }
        res.json(resp);
      });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR user/addMessageFeed] Invalid parameters for ${phone}`)
    res.json(resp);
  }
};

module.exports = addMessageFeed;
