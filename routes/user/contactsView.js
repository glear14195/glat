"use strict";

var user = require('../../lib/user');

var contactsView = function (req, res) {
  var resp = {'status':'fail','err':'','resp':[]};
  var contacts = req.data.contacts || '';
  var phone = req.data.phone || '';
  var gid = req.data.gid || ``;
  
  if (contacts && Array.isArray(contacts) && phone) {
    user.getNames(contacts, gid, phone, function (err, result) {
      if (!err) {
        resp.status = 'success';
        resp.resp = result;
      } else {
        console.log(`[ERROR user/contactsView] for ${phone}: ${err}`);
        resp.err = err;
      }
      res.json(resp);
    });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR user/contactsView] Invalid parameters for ${phone}`)
    res.json(resp);
  }
};

module.exports = contactsView;
