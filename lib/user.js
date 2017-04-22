"use strict";

var butils = require('../lib/butils');
var groupHandler = require('../lib/group');
var pgclient = require('../models/pgclient');
var queryString = require('querystring');
var as = require('async');
var fs = require('fs');
var solr = require('solr-client');

var solrClient = solr.createClient({ core: 'gpsShit' });

var user = {
  'is_user': function (user, cb) {
    pgclient.execute(`select count(*) from users where phone = '${user}'`,
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
  'are_users': function (users, cb) {
    as.map(users, user.is_user, cb);
  },
  'filterUsersAsync': function (users, cb) {
    as.filter(users, user.is_user, function (err, u) {
      if (err) cb(err);
      else {
        as.reject(users, user.is_user, function (err, nu) {
          if (err) cb(err);
          else {
            cb(null, { 'u': u, 'nu': nu });
          }
        });
      }
    });
  },
  'filterUsers': function (users, cb) {
    var orderDict = users.map(function (user, index) {
      return "('" + user + "'," + index + ")";
    });
    var query = `select (case when u.phone is not null then true else false end) as is_user,x.id as phone 
    from users u right join (values ${orderDict.join(",")}) as x(id,ordering) on x.id = u.phone order by 
    (case when u.phone is not null then true else false end) desc,x.ordering;`
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
          return list
        }, []);
        cb(null, ret);
      } else {
        cb('execution_error');
      }

    });
  },
  getDname: function (contactName, appName) {
    return `${appName} (${contactName})`;
  },
  getNames: function (users, gid, phone, cb) {
    if (Array.isArray(users) && users.length) {
      var extraCond = gid ? `left join group_members gm on gm.gid = ${gid} and gm.uid = u.phone` : ``;
      var extraCol = gid ? `,(case when gm.id is null then false else true end) as is_member` : ``;
      var map_dict = {};
      users.forEach(function (userObj) {
        var temp_key = butils.cleanPhone(userObj.phone);
        if (temp_key && temp_key !== phone) map_dict[temp_key] = { name: userObj.name, phone: userObj.phone };
      });

      fs.writeFile(`contacts/${phone}.txt`, JSON.stringify(map_dict, null, 4), function (err) {
        if (err) {
          return console.log(err);
        }
        console.log(`The contacts for ${phone} were saved!`);
      });

      var query = `with a as (select unnest(ARRAY['${Object.keys(map_dict).join("','")}']) as num)
    select a.num as phone,u.dname ${extraCol} from a join users u on u.phone = a.num ${extraCond} 
    order by ${gid ? `is_member desc,` : ``}u.dname ;`

      pgclient.execute(query, function (err, result) {
        if (!err && result) {
          result = result.map((retObj) => ({ phone: map_dict[retObj.phone].phone, dname: user.getDname(map_dict[retObj.phone].name, retObj.dname), is_member: retObj.is_member || false }));
          cb(null, result);
        } else {
          cb('execution_error');
        }
      });
    } else {
      cb(`Invalid parameters`);
    }
  },

  // Get nearby groups from solr
  // SOI -> get group working on solr, and maybe join -> will significantly reduce formatting done later
  getGroupsList: function (phone, latLong, cb) {
    if (phone && latLong) {
      var queryStr = [];
      queryStr.push(`q=*:*`);
      queryStr.push(`sfield=location_p`);
      queryStr.push(`pt=${latLong}`);
      queryStr.push(`sort=geodist()+asc`);
      queryStr.push(`fq={!join from=group_id_i to=gid_i}user_id_s:${phone}`);
      queryStr.push(`facet=true`);
      queryStr.push(`facet.field=gid_i`);
      queryStr.push(`facet.pivot=gid_i,visible_status_i`);
      queryStr.push(`facet.mincount=1`);
      queryStr.push(`fl=gid_i`);
      //queryStr.push(`fq={!collapse field=gid_i}`);
      //Works like group ^, group somehow not working (coz of join ?)
      //queryStr.push(`fq={!join from=gid_i to=groupId_i}visible_status_i:0`);
      //Not working (probably cos of the record we are working on (message))
      queryStr = queryStr.join(`&`);
      queryStr = queryString.parse(queryStr);
      
      solrClient.search(queryStr, function (err, result) {
        if (err) {
          cb(err, null);
        } else if (result && result.response) {
          var numFound = result.response.numFound || ``;
          var docs = result.response.docs || [];
          var facetStuff = result.facet_counts ? result.facet_counts : ``;
          if (numFound && docs && facetStuff) {
            var temp = {};
            var order = docs.map((element) => {
              if (temp.hasOwnProperty(element["gid_i"])) { 
                return null; 
              } else { 
                temp[element["gid_i"]] = 1;
                return element["gid_i"];
              }
            }).filter((element) => element);
            var facetPivot = facetStuff.facet_pivot && Object.keys(facetStuff.facet_pivot).length ? facetStuff.facet_pivot["gid_i,visible_status_i"] : {};
            
            //Pivot formatting
            temp = {};
            
            function getCountForValue (obj, val) {
              if (obj) {
                return (obj.map((element)=>(element["value"] === val ? element["count"] : null)).filter((isNotNull)=>isNotNull))[0] || 0;
              } else {
                return 0;
              }
            }
            
            facetPivot.forEach((pivotObj) => {
              temp[pivotObj["value"]] = getCountForValue(pivotObj["pivot"], 0);
            });

            groupHandler.getGroupNames(order, function (err, result) {
              if (err) {
                cb(`Error in retrieving group names`);  
              } else {
                var retObj = result.map((groupDetails) => {
                  return {
                    gname: groupDetails.gname,
                    gid: groupDetails.id,
                    unread_count: temp[groupDetails.id],
                    pic_location: groupDetails.pic_location || ``
                  }
                });
                cb(null, retObj);
              }
            });
          } else {
            cb (null, []);
          } 
        } else {
          cb(null, {});
        }
      });
    } else {
      cb(`Invalid parameters`);
    }
  }
}

module.exports = user;

//-------------------------------------------

if (require.main === module) {
  (function () {
    user.getGroupsList('918778131717','-12.2,23.122',function (err, result) {
      console.log(JSON.stringify(result, null, 2));
    });
  })();
}