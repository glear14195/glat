var express = require('express');
var routes = require('./routes');
var fs = require('fs');

var bodyParser = require('body-parser');
var app = express();

app.post('/imageTest',function(req,res){
    var imgFile = '';
    req.on('data', function (data) {
        imgFile += data;    
        //console.log(imgFile);
    });
    req.on('error', function (data) {
       // console.log(imgFile, req.body);
    });
    req.on('end', function() {
        Object.keys(imgFile);
        fs.writeFile("test.jpg", JSON.parse(imgFile).File, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    });    
});
app.use(bodyParser.json());
app.use(function(req,res,next){
                    console.log(req.method+" request from "+req.ip+" "+JSON.stringify(req.body)+" "+req.url);
                    next();
});

app.use('/',routes);
//app.use(routes.mw.logErrors);
//app.use(routes.mw.errorHandler);

app.listen('8080','0.0.0.0');
