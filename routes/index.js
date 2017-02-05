var express = require('express');
var mw = require('./middleware');
var user = require('./user');
var routes = express.Router();

routes.post('/user/signup',mw.navigate,user.signup);
routes.post('/swap',function(req,res){
    console.log(req.ip+" "+req.body.name);
    res.send(JSON.stringify({"Name":req.body.age,"Age":req.body.name}));
});

routes.post('/printBody',function(req,res){
    res.send(req.body);
    console.log(req.body);
});
routes.post('/hello',function(req,res){
    console.log(req.ip+" "+req.body.name);
    res.send(JSON.stringify({"Msg":"Hello "+req.body.name,"Square":Math.pow(req.body.age,2)}));
});

routes.post('/gps',mw.gpsStore,function(req,res){
    console.log("Probably Done?");
    res.send("Done...");
});

module.exports = routes;