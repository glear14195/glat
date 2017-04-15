"use strict";

var SHA256 = require("crypto-js").SHA256;
var chance = require('chance');
var jobs = require('../../lib/jobs');

var v1 = function (req, res) {
  var file = req.data.file || ``;
  var phone = req.data.phone || ``;
  var resp = { status: "fail", err: "",resp: ""};
  if (phone && file) {
    // Generating fileName for storing on server
    var fileName = SHA256((new Date()).getTime().toString() + phone + new chance().string({ length: 16, pool: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" })).toString();
    jobs.uploadFile({ file: file, name: fileName, phone: phone });
    resp.status = "success";
    resp.resp = fileName;
    res.json(resp);
  } else {
    console.error(`[ERROR fileHandler/upload] Invalid parameters for ${phone}`);
    resp.err = "Incorrect parameters";
    res.json(resp);
  }
}

module.exports = v1;

/* ---------------------------------------- */

if (require.main === module) {
  var req = {
    data: {
      file: "Niranj Jyothish is feeding me oranges",
      phone: "919962036295"
    }
  }
  var res = {
    json: function (data) {
      console.log(data);
    }
  }
  v1(req, res);
}
