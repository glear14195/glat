"use strict";

var solr = require('solr-client');
var jobs = require('./jobs');

var solrclient = solr.createClient({ core: 'gpsShit' });

var messageHandler = {
  createMessage: function (msgObj, cb) {
    if (msgObj && Number(msgObj.gid) && Number(msgObj.mid) && msgObj.lat && msgObj.long && msgObj.sensorData) {
      
      jobs.msgSolrAdd(msgObj);
    } else {
      cb('Missing Arguments');
    }
  },
  createMessageSolr: function (msgObj, cb) {
    if (msgObj && Number(msgObj.gid) && Number(msgObj.mid) && msgObj.lat && msgObj.long && msgObj.sensorData) {
      var solrObj = {
        msg_s: msgObj.body, 
        location_p: msgObj.lat + "," + msgObj.long, 
        gid_i: msgObj.gid,
        mid_i: msgObj.mid,
        sensordata_txt: JSON.stringify(msgObj.sensorData) 
      };
      solrclient.add(solrObj,
        function (err, obj) {
        if (err) {
          cb(err);
        } else {
          cb(null, `Added message (gid-mid) (${msgObj.gid}-${msgObj.mid}))`);
        }
      });
    } else {
      cb('Missing Arguments');
    }
  }
}

module.exports = messageHandler;
