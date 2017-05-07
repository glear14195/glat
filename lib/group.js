var pgclient = require('../models/pgclient');
var Jobs = require('../lib/jobs');
var GroupMembers = require('../models/group_members');
var solr = require('solr-client');
var async = require('async');
var moment = require('moment');

var solrClient = solr.createClient({ core: 'gpsShit' });
var group = {
  addMembers: function (gid, mems, adminNum, cb) {
    if (mems.constructor !== Array) mems = [mems];
    if (gid && mems && adminNum) {
      async.forEach(mems, function (mem, callback) {
        GroupMembers.update({ where: {gid: gid} }, {status: 0}, function (err, updatedRows) {
          if (err) {
            cb (err, null);
          } else {
            GroupMembers.updateOrCreate({ gid: gid, uid: mem }, {status: 1, is_admin: mem === adminNum}, function (err, result) {
              if (err) {
                callback(err);
              } else {
                callback(null);
              }
            });
          }
        });
      }, function (err) {
        if (err) {
          cb(err, null);
        } else {
          cb(null, `done`);
          Jobs.membersSolrAdd(gid);
          Jobs.messageLogAddForGid(gid);
        }
      });
    } else {
      cb (`Missing parameters`, null);
    }
  },

  addMembersSolr: function (gid, cb) {
    if (gid) {
      solrClient.deleteByQuery(`type_s:members && group_id_i:${gid}`, function (err, result) {
        if (err) {
          cb (err, null);
        } else {
          GroupMembers.find({where: {gid: gid, status: 1}}, function (err, members) {
            if (err) {
              cb (err, null);
            } else {
              async.each(members, group.addMemberSolr, function (err, result) {
                if (err) {
                  cb (err, null);
                } else {
                  solrClient.commit(cb);
                }
              });
            }
          });
        }
      });
    } else {
      cb (`Missing parameters`, null);
    }
  },

  addMemberSolr: function (memObj, cb) {
    if (memObj.gid && memObj.uid) {
      var solrObj = {
        group_id_i: memObj.gid,
        user_id_s: memObj.uid,
        member_id_i: memObj.id,
        status_i: memObj.status,
        is_admin_b: memObj.is_admin,
        type_s: "members"
      };
      solrClient.add(solrObj, function (err, response) {
        if (err) {
          cb(err);
        } else {
          console.log(response);
          if (memObj.src === "one_time") {
            cb(null, `Added member (gid-uid) (${memObj.gid}-${memObj.uid}))`);
          } else {
            solrClient.commit(function (err, res) {
              if (err) {
                cb(err);
              } else {
                cb(null, `Added member (gid-uid) (${memObj.gid}-${memObj.uid}))`);
              }
            });
          }
        }
      });
    } else {
      cb('Missing Arguments');
    }
  },

  addGroupSolr: function (grpObj, cb) {
    if (grpObj.id && grpObj.uid) {
      var solrObj = {
        groupId_i: grpObj.id,
        userId_s: grpObj.uid,
        gname_s: grpObj.gname,
        is_active_b: grpObj.is_active,
        created_at_dt: moment(grpObj.created_at).toISOString(),
        type_s: "groups"
      };
      solrClient.add(solrObj, function (err, response) {
        if (err) {
          cb(err);
        } else {
          console.log(response);
          if (grpObj.src === "one_time") {
            cb(null, `Added group (gid-uid) (${grpObj.id}-${grpObj.uid}))`);
          } else {
            solrClient.commit(function (err, res) {
              if (err) {
                cb(err);
              } else {
                cb(null, `Added group (gid-uid) (${grpObj.id}-${grpObj.uid}))`);
              }
            });
          }
        }
      });
    } else {
      cb('Missing Arguments');
    }
  },

   filterMembers: function (gid, users, cb) {
    var orderDict = users.map(function (user, index) {
      return "('" + user + "'," + index + ")";
    });
    var query = `select (case when gm.uid is not null then true else false end) as is_user,x.id as phone 
    from (select * from group_members where gid = ${gid}) as gm right join (values ${orderDict.join(",")}) 
    as x(id,ordering) on x.id = gm.uid order by (case when gm.uid is not null then true else false end) desc,x.ordering;`;
    pgclient.execute(query, function (err, rows) {
      if (!err && rows) {
        var ret = {
          u: [],
          nu: []
        };
        ret.u = rows.reduce(function (list, row) {
          if (row.is_user) list.push(row.phone);
          return list
        }, []);
        ret.nu = rows.reduce(function (list, row) {
          if (!row.is_user) list.push(row.phone);
          return list;
        }, []);
        cb(null, ret);
      } else {
        cb('execution_error');
      }
    });
  },
  
  getGroupNames: function (groupList, phone, cb) {
    if (Array.isArray(groupList) && phone) {
      var orderDict = groupList.map(function (gid, index) {
        return "(" + gid + "," + index + ")";
      });
      var extraCond = `left join (values ${orderDict.join(",")})
      as x(id,ordering) on x.id = g.id`
      var query = `select g.* from groups as g join group_members gm on gm.gid = g.id 
      and gm.uid = '${phone}' ${groupList.length? extraCond: ``} order by ${groupList.length? `x.ordering,`:``}g.gname`;
      pgclient.execute(query, cb);
    } else {
      cb (`Invalid parameters`);
    }
  }
}

module.exports = group;

//----------------------------------------------

if (require.main === module) {
  (function () {
    // group.setAdmin(18, '1234567890', function (err, result) {
    //   if (err) console.log(err);
    //   else console.log(result);
    // });
    // group.filterMembers(1, ['1234567890', '111', '918566', '123'], function (err, result) {
    //   console.log(err, result);
    // });
    group.getGroupNames([], '919176858430', function(err, result) {
       console.log(err || result);
    });
    group.addMembers(200, ['919790239111', '919790860738'], '919790860738', function (err, result) {
      console.log(err, result);
    });
  })()
}
