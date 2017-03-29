var Groups = require('../../models/groups');
var userHandler = require('../../lib/user');
var groupHandler = require('../../lib/group');
var butils = require('../../lib/butils');

function addMemsToGid(mems, gid, phone, cb) {
  mems.push(phone);
  var uniqueMems = Array.from(new Set(mems));
  userHandler.filterUsers(uniqueMems, function (err, U) {
    if (err) {
      cb(err);
    } else {
      var toAdd = U.u;
      groupHandler.addMembers(gid, toAdd, function (err) {
        if (err) {
          cb(err);
        } else {
          groupHandler.setAdmin(gid, phone, function (err, r) {
            if (err) {
              cb(err);
            } else {
              cb(null, {
                added: toAdd,
                notAdded: U.nu
              });
            }
          });
        }
      });
    }
  });
}

var add = function (req, res) {
  var resp = { 'status': 'fail', 'err': '', 'resp': {} };
  var phone = req.data.phone || ``;
  var gname = req.data.gname || ``;
  var mems = req.data.mems || [];
  var reqGid = req.data.gid || ``;
  mems = mems.map((phone) => butils.cleanPhone(phone));
  if (phone && gname && Array.isArray(mems)) {
    Groups.findOne({ where: { uid: phone, gname: gname } }, function (err, groupDetails) {
      if (err) {
        console.log(`[ERROR group/updateOrCreate] for ${phone}: ${err}`);
        resp.err = err;
        res.json(resp);
      } else {
        if (!reqGid && groupDetails) {
          console.log(`[ERROR group/updateOrCreate] for ${phone}: Group already exists`);
          resp.err = 'Group already exists';
          res.json(resp);
        } else {
          var gid;
          if (!groupDetails) {
            Groups.create({ uid: phone, gname: gname }, function (err, groupDetails) {
              if (err) {
                console.log(`[ERROR group/updateOrCreate] Could not create group for ${phone}: ${err}`);
                resp.err = 'execution_error';
                res.json(resp);
              } else {
                gid = groupDetails.id;
                addMemsToGid(mems, gid, phone, function (err, response) {
                  if (err) {
                    console.log(`[ERROR group/updateOrCreate] Could not add members to group for ${phone}: ${err}`);
                    resp.err = 'execution_error';
                  } else {
                    resp.status = `success`;
                    Object.assign(resp.resp, response);
                    resp.resp.gid = gid;
                  }
                  res.json(resp);
                });
              }
            });
          } else {
            gid = reqGid;
            Groups.update({id: gid, uid: phone}, {gname: gname}, function (err, updatedDetails) {
              if (err) {
                console.log(`[ERROR group/updateOrCreate] Could not update group for ${phone}: ${err}`);
                resp.err = 'execution_error';
                res.json(resp);
              } else {
                addMemsToGid(mems, gid, phone, function (err, response) {
                  if (err) {
                    console.log(`[ERROR group/updateOrCreate] Could not add members to group for ${phone}: ${err}`);
                    resp.err = 'execution_error';
                  } else {
                    resp.status = `success`;
                    Object.assign(resp.resp, response);
                    resp.resp.gid = gid;
                  }
                  res.json(resp);
                });
              }
            });
          }
        }
      }
    });
    resp.err = 'Missing Arguments';
    res.json(resp);
  } else {
  }
}

module.exports = add;   