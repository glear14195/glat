"use strict";

var moment = require('moment');
var messageHandler = require('../../lib/message');

var displayMessageFeed = function (req, res) {
  var resp = { 'status': 'fail', 'err': '', 'resp': [] };

  var phone = req.data.phone || '';
  var gid = req.data.gid || '';
  var mid = req.data.mid || '';

  if (gid && mid && phone) {
    messageHandler.getMessageFeed(gid, mid, function (err, result) {
      if (!err) {
        resp.status = 'success';
        result.map((element) => {
          element.createdAt = moment(element.createdat).format(`dddd, MMMM Do YYYY, h:mm a`);
          delete element.createdat;
        });
        resp.resp = result;
      } else {
        console.log(`[ERROR user/displayMessageFeed] for ${phone}: ${err}`);
        resp.err = err;
      }
      res.json(resp);
    });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR user/displayMessageFeed] Invalid parameters for ${phone}`)
    res.json(resp);
  }
};

module.exports = displayMessageFeed;

//----------------------------------------------

if (require.main === module) {
  var req = {
    data: {
      phone: "919962036295",
      gid: 42,
      mid: 4
    }
  };

  var res = {
    json: function (data) {
      console.log(data);
    }
  };

  displayMessageFeed(req, res);
}