var pgclient = require('../models/pgclient');
var Jobs = require('../lib/jobs');
var GroupMembers = require('../models/group_members');
var solr = require('solr-client');
var as = require('async');
var moment = require('moment');

var solrClient = solr.createClient({ core: 'gpsShit' });
var group = {
  addMembers: function (gid, mems, cb) {
    if (mems.constructor !== Array) mems = [mems];
    as.forEach(mems,
      function (mem, callback) {
        GroupMembers.create({ gid: gid, uid: mem }, function (err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null);
            Jobs.memberSolrAdd(result);
          }
        });
      }, cb);
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
  setAdmin: function (gid, phone, cb) {
    group.isMember(gid, phone, function (err, result) {
      if (err) cb(err);
      else {
        if (result) {
          pgclient.execute(`update group_members set is_admin = true where uid='${phone}' and gid=${gid}`,
            function (err, res) {
              if (err) cb(err);
              else {
                cb(null, '1');
              }
            });
        } else cb(null, '0');
      }
    });
  },
  isMember: function (gid, phone, cb) {
    pgclient.execute(`select count(*) from group_members where uid = '${phone}' and gid = ${gid}`,
      function (err, result) {
        if (err) {
          cb(err);
        } else if (result && result.length) {
          if (result[0].count == '0')
            cb(null, false);
          else cb(null, true);
        }
      });
  },
  filterMembersAsync: function (gid, phones, cb) {
    function isM(p, rcb) {
      group.isMember(gid, p, rcb);
    }
    as.filter(phones, isM, function (err, u) {
      if (err) cb(err);
      else {
        as.reject(phones, isM, function (err, nu) {
          if (err) cb(err);
          else {
            cb(null, { 'u': u, 'nu': nu });
          }
        });
      }
    });
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
      var query = `select g.* from groups as g join group_members gm on gm.gid = g.id 
      and gm.uid = '${phone}' left join (values ${orderDict.join(",")}) 
      as x(id,ordering) on x.id = g.id order by x.ordering`;
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
    group.setAdmin(18, '1234567890', function (err, result) {
      if (err) console.log(err);
      else console.log(result);
    });
    group.filterMembers(1, ['1234567890', '111', '918566', '123'], function (err, result) {
      console.log(err, result);
    });
    group.addMembers(22, ['919790239111', '919790860738'], function (err, result) {
      console.log(err, result);
    });
  })()
}