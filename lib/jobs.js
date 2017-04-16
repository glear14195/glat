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
  memberSolrAdd: function (memObj) {
    jobs.create('memberSolrAdd', memObj).save();
  },
};

module.exports = jobHandler;
