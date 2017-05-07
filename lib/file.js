"use strict";

var SHA256 = require("crypto-js").SHA256;
var chance = require('chance');
var jobs = require('./jobs');

var fileHandler = {
  getName: function (phone) {
    return SHA256((new Date()).getTime().toString() + phone + new chance().string({ length: 16, pool: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" })).toString();
  },
  uploadFile: function (file, phone, fileName) {
    fileName = fileName || fileHandler.getName(phone);
    jobs.uploadFile({ file: file, name: fileName, phone: phone });
    return fileName;
  }
};

module.exports = fileHandler;
