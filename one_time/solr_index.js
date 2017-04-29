"use strict";

var async = require('async');
var solr = require('solr-client');

var Message = require('../models/message');
var GroupMembers = require('../models/group_members');
var Groups = require('../models/groups');

var messageHandler = require('../lib/message');
var groupHandler = require('../lib/group');

var solrClient = solr.createClient({ core: 'gpsShit' });

function solrIndex(type) {
  if (type === `message`) {
    console.log(`Deleting Solr documents...`);
    solrClient.deleteByQuery('type_s:message', function (err, delObj) {
      if (err) {
        console.log(`[ERR one_time/solr_index] Solr -> ${err}`);
      } else {
        console.log(`Deleted Solr documents.`);
        Message.find({ where: { visible_status: { nin: [2] } } }, function (err, result) {
          if (err) {
            console.log(`[ERR one_time/solr_index] Caminte -> ${err}`);
          } else {
            if (result) {
              async.forEach(result, function (msgObj, callback) {
                msgObj.src = 'one_time'; // To make single commit
                messageHandler.createMessageSolr(msgObj, callback);
              }, function (err, result) {
                if (err) {
                  console.log(`[ERR one_time/solr_index] async -> ${err}`);
                } else {
                  console.log(`Done indexing`);
                  solrClient.commit(function (err, res) {
                    if (!err) {
                      console.log(`Commit succesful!`);
                    } else {
                      console.log(`[ERR one_time/solr_index] commit -> ${err}`);
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  } else if (type === "members") {
    console.log(`Deleting Solr documents...`);
    solrClient.deleteByQuery('type_s:members', function (err, delObj) {
      if (err) {
        console.log(`[ERR one_time/solr_index] Solr -> ${err}`);
      } else {
        console.log(`Deleted Solr documents.`);
        GroupMembers.find({ where: { status: { in: [1] } } }, function (err, result) {
          if (err) {
            console.log(`[ERR one_time/solr_index] Caminte -> ${err}`);
          } else {
            if (result) {
              async.forEach(result, function (memObj, callback) {
                memObj.src = "one_time";
                groupHandler.addMemberSolr(memObj, callback);
              }, function (err, result) {
                if (err) {
                  console.log(`[ERR one_time/solr_index] async -> ${err}`);
                } else {
                  console.log(`Done indexing`);
                  solrClient.commit(function (err, res) {
                    if (!err) {
                      console.log(`Commit succesful!`);
                    } else {
                      console.log(`[ERR one_time/solr_index] commit -> ${err}`);
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  } else if (type === "groups") {
    console.log(`Deleting Solr documents...`);
    solrClient.deleteByQuery('type_s:groups', function (err, delObj) {
      if (err) {
        console.log(`[ERR one_time/solr_index] Solr -> ${err}`);
      } else {
        console.log(`Deleted Solr documents.`);
        Groups.find({ where: { is_active: true } }, function (err, result) {
          if (err) {
            console.log(`[ERR one_time/solr_index] Caminte -> ${err}`);
          } else {
            if (result) {
              async.forEach(result, function (memObj, callback) {
                memObj.src = "one_time";
                groupHandler.addGroupSolr(memObj, callback);
              }, function (err, result) {
                if (err) {
                  console.log(`[ERR one_time/solr_index] async -> ${err}`);
                } else {
                  console.log(`Done indexing`);
                  solrClient.commit(function (err, res) {
                    if (!err) {
                      console.log(`Commit succesful!`);
                    } else {
                      console.log(`[ERR one_time/solr_index] commit -> ${err}`);
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  }
}

/* --------------------------------------------------------- */

if (require.main === module) {
  // set argument as message or members
  solrIndex('message');
  //solrIndex('members');

}
