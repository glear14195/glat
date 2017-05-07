"use strict";

var exec = require('child_process').exec;
var path = require('path');
var jobs = require('../../lib/jobs');
var fileHandler = require('../../lib/file');

const algoPath = path.resolve(__dirname, `../../app`);

function getResolvedPath(pathToResolve) {
  return path.resolve(__dirname, `../../images`, pathToResolve + `.glat`);
}

var detectMessage = function (req, res) {
  var resp = { 'status': 'fail', 'err': '', 'resp': `` };
  
  var objectPath = req.data.objectPath || ``;
  var sceneImg = req.data.sceneImg || ``;
  var phone = req.data.phone || ``;

  if (objectPath && sceneImg && phone) {
    objectPath = getResolvedPath(objectPath);
    sceneImg = getResolvedPath(sceneImg);
    var outputFileName = fileHandler.getName(phone);
    console.log(`.${algoPath} ${objectPath} ${sceneImg} ${getResolvedPath(outputFileName)}`);
    exec(`.${algoPath} ${objectPath} ${sceneImg} ${getResolvedPath(outputFileName)}`, function (err, stdout, stderr) {
      if (err) {
        console.log(`[ERROR group/detectMessage] error: ${stderr}`);
        resp.err = err;
        res.json(resp);
      } else {
        resp.status = `success`;
        resp.resp = outputFileName;
        res.json(`done`);
      }
    });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR group/detectMessage] Invalid parameters for ${phone}`)
    res.json(resp);
  }
};

module.exports = detectMessage;

// ---------------------------------------------------------

if (require.main === module) {
  var req = {
    data: {
      objectPath: '1545375606ce0605726dab0eb75fd2b8baffece439a9e9fb760ee173e353764d',
      sceneImg: '7198626ba1df623bc40aa756ace515bfa9e8faa6497585a55cca0682c029c480',
      phone: '9962036295'
    }
  };
  var res = {
    json: function (data) {
      console.log(data);
    }
  }
  detectMessage(req,res);
}
