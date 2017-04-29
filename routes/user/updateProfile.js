"use strict";

var User = require('../../models/users');

var updateProfile = function (req, res) {
  var resp = { 'status': 'fail', 'err': '', 'resp': [] };

  var phone = req.data.phone || '';
  var name = req.data.name || '';
  var picLoc = req.data.picLoc || '';
  var updateDict = {};
  picLoc ? updateDict.pic_location = picLoc : null;
  name ? updateDict.dname = name : null;
  
  if (phone && Object.keys(updateDict).length) {
    User.update({ where: { phone: phone } }, updateDict, function (err, result) {
      if (!err) {
        resp.status = 'success';
        resp.resp = 'Profile updated';
      } else {
        console.log(`[ERROR user/updateProfile] for ${phone}: ${err}`);
        resp.err = err;
      }
      res.json(resp);
    });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR user/updateProfile] Invalid parameters for ${phone}`)
    res.json(resp);
  }
};

module.exports = updateProfile;
