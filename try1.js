var express = require('express');
var routes = require('./routes');
var fileHandler = require('./filehandler');
var mw = require('./routes/middleware');
var bodyParser = require('body-parser');
var app = express();


app.post('/file/upload', mw.multiPart, mw.navigate, mw.checkToken, fileHandler.upload.v1);
app.post('/file/download', mw.multiPart, mw.navigate, mw.checkToken, fileHandler.download.v1);

app.use(bodyParser.json());

//app.use(/^\/image.*/, mw.multiPart);
// ^ check why not working
app.use(function (req, res, next) {
    console.log(req.method + " request from " + req.ip + " " + Object.keys(req.body).map((key) => (`(${key}: ${typeof req.body[key]})`)).join("; ") + " " + req.url + " " + (new Date()).toString());
    next();
});

app.use('/', routes);
//app.use(routes.mw.logErrors);
//app.use(routes.mw.errorHandler);

app.listen('8080', '0.0.0.0');
