"use strict";

var butils = require('../../lib/butils');
var userHandler = require('../../lib/user');

var groupListView = function (req, res) {

  var resp = { 'status': 'fail', 'err': '', 'resp': [] };
  var phone = req.data.phone || ``;
  var latLong = butils.cleanLatLong(req.data.lat, req.data.long);

  if (phone && latLong) {
    userHandler.getGroupsList(phone, latLong, function (err, result) {
      if (!err) {
        resp.status = 'success';
        resp.resp = result;
      } else {
        console.log(`[ERROR user/groupListView] for ${phone}: ${err}`);
        resp.err = err;
      }
      res.json(resp);
    });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR user/groupListView] Invalid parameters for ${phone}`)
    res.json(resp);
  }
};

module.exports = groupListView;
