"use strict";

var async = require('async');
var groups = require('../../models/groups');
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
        if (gid) {
          groups.findOne({where: {uid: phone, id: gid}}, function (err, groupDetails) {
            if (err) {
              console.log(`[ERROR user/contactsView] for ${phone}: ${err}`);
              resp.err = err;
              res.json(resp);
            } else {
              resp.status = 'success';
              resp.resp = {
                contacts: result,
                isAdmin: groupDetails ? true : false
              }
              res.json(resp);
            }
          });
        } else {
          resp.status = 'success';
          resp.resp = {
            contacts: result,
            isAdmin: true
          }
          res.json(resp);
        }
      } else {
        console.log(`[ERROR user/contactsView] for ${phone}: ${err}`);
        resp.err = err;
        res.json(resp);
      }
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
      gid: 23,
      contacts: [{phone: "8778131717", name: "Chu"}, {phone: "9790860738", name: "Suki love"}, {phone: "9790239111", name: "Shreyas moon"}],
      phone: "1234567890"
    }
  };

  var res = {
    json: function(data) {
      console.log(data);
    }
  }

  contactsView(req, res);
}
