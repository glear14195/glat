"use strict";

var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var jobs = require('../../lib/jobs');
var fileHandler = require('../../lib/file');

const algoPath = path.resolve(__dirname, `../../app`);

function getResolvedPath(pathToResolve, ext) {
  return path.resolve(__dirname, `../../images`, pathToResolve + `.${ext}`);
}

var detectMessage = function (req, res) {
  var resp = { 'status': 'fail', 'err': '', 'resp': `` };
  
  var objectPath = req.data.objectPath || ``;
  var sceneImg = req.data.sceneImg || ``;
  var phone = req.data.phone || ``;

  if (objectPath && sceneImg && phone) {
    objectPath = getResolvedPath(objectPath, `glat`);
    sceneImg = getResolvedPath(sceneImg, `glat`);
    var outputFileName = fileHandler.getName(phone);
    console.log(`.${algoPath} ${objectPath} ${sceneImg} ${getResolvedPath(outputFileName, `jpg`)}`);
    exec(`${algoPath} ${objectPath} ${sceneImg} ${getResolvedPath(outputFileName, `jpg`)}`, function (err, stdout, stderr) {
      if (err) {
        console.log(`[ERROR group/detectMessage] error: ${stderr}`);
        resp.err = err;
        res.json(resp);
      } else {
        resp.status = `success`;
        resp.resp = outputFileName;
        fs.renameSync(getResolvedPath(outputFileName, `jpg`), getResolvedPath(outputFileName, `glat`));
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
      objectPath: 'param1',
      sceneImg: 'param2',
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
