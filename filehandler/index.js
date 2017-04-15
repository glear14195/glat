"use strict";

var up = require('./upload');
var down = require('./download');

var download = {
  upload: up,
  download: down
};

module.exports = download;
