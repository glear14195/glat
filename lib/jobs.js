"use strict";

var kue = require('kue');
var config = require('./config');

var jobs = kue.createQueue(config.kue_config);

var jobHandler = {
  msgSolrAdd: function (msgObj) {
    jobs.create('msgSolrAdd', msgObj).save();
  },
  uploadFile: function (fileObj) {
    jobs.create('uploadFile', fileObj).save();
  },
  membersSolrAdd: function (gid) {
    jobs.create('membersSolrAdd', gid).save();
  },
  messageLogAdd: function (msgId) {
    jobs.create('messageLogAdd', msgId).save();
  },
  messageLogAddForGid: function (msgId) {
    jobs.create('messageLogAddForGid', msgId).save();
  }
};

module.exports = jobHandler;
