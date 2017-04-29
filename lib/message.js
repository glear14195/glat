"use strict";

var async = require('async');
var moment = require('moment');
var solr = require('solr-client');
var queryString = require('querystring');

var jobs = require('./jobs');
var userHandler = require('../lib/user'); 

var Message = require('../models/message');
var MessageLog = require('../models/message_log');
var pgClient = require('../models/pgclient');

var solrClient = solr.createClient({ core: 'gpsShit' });

var messageHandler = {
  createMessage: function (msgObj, cb) {
    if (msgObj && Number(msgObj.gid) && msgObj.uid && msgObj.latlong && msgObj.sensorData && msgObj.body) {
      var sqlObj = {
        gid: msgObj.gid,
        latlong: msgObj.latlong,
        sensor_data: msgObj.sensorData,
        body: msgObj.body,
        uid: msgObj.uid
      }
      Message.create(sqlObj, function (err, msg) {
        if (err) {
          cb(err);
        } else {
          cb(null, msg);
          jobs.msgSolrAdd(msg);
          jobs.messageLogAdd(msg.id);
        }
      });
    } else {
      cb('Missing Arguments');
    }
  },
  messageLogAdd: function (msgId, cb) {
    if (msgId) {
      var query = `insert into message_log(gid, uid, mid, status) 
      select gm.gid, gm.uid, m.id, (case when gm.uid = m.uid then 2 else 0 end) from message m 
      join group_members gm on gm.gid = m.gid and m.id = ${msgId} and gm.status = 1`;
      pgClient.execute(query, cb);
    } else {
      cb (`Missing parameters`, null);
    }
  },
  createMessageSolr: function (msgObj, cb) {
    if (msgObj && Number(msgObj.gid) && Number(msgObj.id) && msgObj.latlong && msgObj.sensor_data) {
      var solrObj = {
        msg_s: msgObj.body,
        location_p: msgObj.latlong,
        gid_i: msgObj.gid,
        mid_i: msgObj.id,
        uid_s: msgObj.uid,
        modified_at_dt: moment(msgObj.modified_at).toISOString(),
        created_at_dt: moment(msgObj.created_at).toISOString(),
        visible_status_i: msgObj.visible_status,
        sensordata_txt: JSON.stringify(msgObj.sensor_data),
        type_s: "message"
      };
      solrClient.add(solrObj,
        function (err, response) {
          if (err) {
            cb(err);
          } else {
            console.log(response);
            if (msgObj.src && msgObj.src === 'one_time') {
              cb(null, `Added message (gid-mid) (${msgObj.gid}-${msgObj.id}))`);
            } else {
              solrClient.commit(function (err, res) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, `Added message (gid-mid) (${msgObj.gid}-${msgObj.id}))`);
                }
              });
            }
          }
        });
    } else {
      cb('Missing Arguments');
    }
  },
  getMessageSolr: function (gid, mid, cb) {
    if (gid && mid) {
      var queryStr = [];
      queryStr.push(`q=type_s:message`);
      queryStr.push(`fq=gid_i:${gid}`);
      queryStr.push(`fq=mid_i:${mid}`);
      queryStr.push(`start=0`);
      queryStr.push(`rows=1`);
      queryStr = queryStr.join(`&`);
      queryStr = queryString.parse(queryStr);
      solrClient.search(queryStr, function (err, result) {
        if (err) {
          cb(err, null);
        } else if (result && result.response) {
          cb(null, result.response);
        } else {
          cb(null, {});
        }
      });
    } else {
      cb(`Invalid parameters`);
    }
  },

  getMessagesForGroupSolr: function (gid, latLong, phone, cb, radialDist) {
    radialDist = radialDist || 10; 
    if (gid && latLong) {
      var queryStr = [];
      queryStr.push(`q=type_s:message`);
      queryStr.push(`fq=gid_i:${gid}`);
      queryStr.push(`fq={!geofilt}`);
      queryStr.push(`fq=visible_status_i:0`);
      queryStr.push(`pt=${latLong}`);
      queryStr.push(`sfield=location_p`);
      queryStr.push(`d=${radialDist}`);
      queryStr = queryStr.join(`&`);
      queryStr = queryString.parse(queryStr);
      solrClient.search(queryStr, function (err, result) {
        if (err) {
          cb(err, null);
        } else if (result && result.response && result.response.docs && result.response.docs.length) {
          var retArr = result.response.docs;
          var phoneList = retArr.map((obj) => obj.uid_s);
          var midList = retArr.map((obj) => obj.mid_i);
          var asyncTasks = {
            nameDict: async.apply(userHandler.getNameDict, phoneList),
            readDict: async.apply(messageHandler.getReadStatus, midList, gid, phone)
          };

          async.parallel(asyncTasks, function (err, result) {
            if (err) {
              cb (err, null);
            } else {
              retArr.map((obj) => {
                obj.createdByName = result.nameDict[obj.uid_s];
                obj.readStatus = result.readDict[obj.mid_i];
              });
              cb(null, retArr.map((retObj) => messageHandler.formatMsgForClient(retObj)));
            }
          });
        } else {
          cb(null, {});
        }
      });
    } else {
      cb(`Invalid parameters`);
    } 
  },

  getMessageFeed: function(gid, mid, cb) {
    if(gid && mid) {
      var query = `select u.dname,mfeed.comment,mfeed.created_at 
      from users u join message_feed mfeed on u.phone=mfeed.uid 
      and mfeed.mid= ${mid} and mfeed.gid= ${gid} order by mfeed.created_at desc `;
      
      pgClient.execute(query, cb);
   } else {
      cb (`Invalid parameters`);
    }
  },

  formatMsgForClient: function (msgObj) {
    if (msgObj) {
      msgObj.location_p = msgObj.location_p.split(`,`);
      return {
        body: msgObj.msg_s,
        lat: msgObj.location_p[0].trim(),
        long: msgObj.location_p[1].trim(),
        gid: msgObj.gid_i,
        mid: msgObj.mid_i,
        createdByNum: msgObj.uid_s,
        createdByName: msgObj.createdByName,
        createdAt: moment(msgObj.created_at_dt).format(`dddd, MMMM Do YYYY, h:mm a`),
        sensorData: msgObj.sensordata_txt,
        readStatus: msgObj.readStatus
      };
    } else {
      return {};
    }
  },

  getReadStatus: function (midList, gid, phone, cb) {
    if (Array.isArray(midList) && phone && gid) {
      MessageLog.find({where: {mid: {in: midList}, gid: gid, uid: phone}}, function (err, messageLogs) {
        if (err) {
          cb(err, null);
        } else {
          var retDict = {};
          messageLogs.map((obj) => retDict[obj.mid] = obj.status);
          cb(null, retDict);
        }
      });
    } else {
      cb(`Missing parameters`, null);
    }
  }
}

module.exports = messageHandler;

//-----------------------------------------------------

if (require.main === module) {
  var msgObj = {
    gid: 24,
    uid: '1234567890',
    sensorData: {
      acc: 123.45,
      gyro: 22
    },
    latlong: "23.456, 34.55",
    body: "This was the next msg stored"
  }
  var solrObj = {
    gid: 24,
    latlong: '23.45,45.66',
    sensor_data: { acc: 123.45, gyro: 22 },
    body: 'This was the first msg stored',
    uid: '1234567890',
    mid: 23
  }

  messageHandler.createMessage(msgObj, function (err, res) {
    console.log(err || res);
  });

  messageHandler.getMessageSolr(24, 23, function (err, res) {
    console.log(err || res);
  });

  messageHandler.getMessagesForGroupSolr(24, '-12.2, 22', '919962036295', function (err, res) {
    console.log(err || res);
  });

  messageHandler.messageLogAdd(21, function (err, res) {
    console.log(err || res);
  });
}
