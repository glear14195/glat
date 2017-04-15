"use strict";

var fs = require('fs');

var v1 = function (req, res) {
  var fileName = req.data.fileName || ``;
  var phone = req.data.phone || ``;
  var resp = { status: "fail", err: "", resp: "" };
  if (phone && fileName) {
    fs.readFile(`images/${fileName}.glat`, `utf8`, function (err, data) {
      if (err) {
        console.error(`[ERROR fileHandler/download] Unable to download for (${phone}, ${fileName}): ${err}`);
        resp.err = "execution_error";
        res.json(resp);
      } else {
        console.log(`[INFO fileHandler/download] ${phone} downloading ${fileName}`);
        resp.status = "success";
        resp.resp = data;
        res.json(resp);
      }
    });
  } else {
    console.error(`[ERROR fileHandler/download] Invalid parameters for ${phone}`);
    resp.err = "Incorrect parameters";
    res.json(resp);
  }
};

module.exports = v1;


/* ---------------------------------------- */

if (require.main === module) {
  var req = {
    data: {
      fileName: "0116881605318ddcb893f2d9816f6ff8d1415102f1b7c0d9eb0dbda7e0612a79",
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
