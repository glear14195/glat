"use strict";

var fs = require('fs');
var kue = require('kue');
var config = require('./lib/config');
var msgHandler = require('./lib/message');
var groupHandler = require('./lib/group');

var jobs = kue.createQueue(config.kue_config);

jobs.on('job complete', function (id, result) {
  kue.Job.get(id, function (err, job) {
    if (err) {
      console.error('fail to get job ' + id + 'error ' + err);
    } else {
      job.remove(function (err) {
        if (err) {
          console.error('fail removed completed job ' + job.id + 'error ' + err);
        } else {
          console.info('removed completed job ' + job.id);
        }
      });
    }
  });
});

jobs.process('msgSolrAdd', function (job, done) {
  var data = job.data;
  if (data) {
    msgHandler.createMessageSolr(data, function (err, res) {
      if (err) {
        console.error(`[ERR msgSolrAdd] ${err}`);
      } else {
        console.info(`[INFO msgSolrAdd] Added message mid: ${data.id}`);
      }
      done();
    });
  } else {
    console.error(`[ERR msgSolrAdd] Wrong Job received`);
    done();
  }
});

jobs.process('uploadFile', function (job, done) {
  var data = job.data;
  var file = data.file || ``;
  var fileName = data.name || ``;
  var phone = data.phone || ``;
  
  if (file && fileName && phone) {
    fs.writeFile(`images/${fileName}.glat`, file, {flag: 'wx'}, function (err) {
      if (err) {
        console.error(`[ERROR uploadFile] ${err}`);
      } else {
        console.log(`[INFO uploadFile] The file ${fileName} was sent by ${phone}`);
      }
      done();
    });
  } else {
    console.error(`[ERR uploadFile] Wrong Job received`);
    done();
  }
});

jobs.process('membersSolrAdd', function (job, done) {
  var data = job.data;
  if (data) {
    groupHandler.addMembersSolr(data, function (err, res) {
      if (err) {
        console.error(`[ERR membersSolrAdd] ${err}`);
      } else {
        console.info(`[INFO membersSolrAdd] Added members for gid: ${data}`);
      }
      done();
    });
  } else {
    console.error(`[ERR membersSolrAdd] Wrong Job received`);
    done();
  }
});

jobs.process('messageLogAdd', function (job, done) {
  var data = job.data;
  if (data) {
    msgHandler.messageLogAdd(data, function (err, res) {
      if (err) {
        console.error(`[ERR messageLogAdd] ${err}`);
      } else {
        console.info(`[INFO messageLogAdd] Added Log for msgId: ${data}`);
      }
      done();
    });
  } else {
    console.error(`[ERR messageLogAdd] Wrong Job received`);
    done();
  }
});

jobs.process('messageLogAddForGid', function (job, done) {
  var data = job.data;
  if (data) {
    msgHandler.messageLogAddForGid(data, function (err, res) {
      if (err) {
        console.error(`[ERR messageLogAddForGid] ${err}`);
      } else {
        console.info(`[INFO messageLogAddForGid] Added Log for gid: ${data}`);
      }
      done();
    });
  } else {
    console.error(`[ERR messageLogAddForGid] Wrong Job received`);
    done();
  }
});
