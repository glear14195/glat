"use strict";

var butils = require('../../lib/butils');
var user = require('../../lib/user');

var contactsView = function (req, res) {
  var resp = {'status':'fail','err':'','resp':[]};  
  var contacts = butils.cleanContactArray(req.data.contacts) || '';
  var phone = req.data.phone || '';
  var gid = req.data.gid || ``;

  if (Array.isArray(contacts) && contacts.length && phone) {
    user.getNamesFromContacts(contacts, gid, phone, function (err, result) {
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

//----------------------------------------------------------------

if (require.main === module) {
  var req = {
    data: {
      contacts: [{phone: "8778131717", name: "Chu"}, {phone: "9790860738", name: "Suki love"}, {phone: "9790239111", name: "Shreyas moon"}],
      phone: "919962036295"
    }
  };

  var res = {
    json: function(data) {
      console.log(data);
    }
  }

  contactsView(req, res);
}
