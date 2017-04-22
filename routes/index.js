var express = require('express');
var mw = require('./middleware');
var user = require('./user');
var group = require('./group');
var routes = express.Router();

routes.post('/user/sendotp',mw.navigate,user.sendotp);
routes.post('/user/login',mw.navigate,user.login);
routes.post('/group/updateOrCreate',mw.navigate,mw.checkToken,group.updateOrCreate);
routes.post('/group/message/add',mw.navigate,mw.checkToken,group.addMessage);
routes.post('/user/contacts/view',mw.navigate, mw.checkToken, user.viewContacts);
routes.post('/user/groupListView',mw.navigate,mw.checkToken,user.groupListView);
routes.post('/group/showMessage',mw.navigate,mw.checkToken,group.showMessage);
routes.post('/user/updateProfile',mw.navigate,mw.checkToken,user.updateProfile);
routes.post('/group/showAllMessages',mw.navigate,mw.checkToken,group.showAllMessages);
routes.post('/group/markMessageRead',mw.navigate,mw.checkToken,group.markMessageRead);


routes.post('/swap',function(req,res){
    console.log(req.ip+" "+req.body.name);
    res.send(JSON.stringify({"Name":req.body.age,"Age":req.body.name}));
});

routes.post('/printBody',function(req,res){
    res.send(req.body);
    console.log(req.body);
});

routes.post('/hello',function(req,res){
    console.log(req.ip+" "+req.body);
    res.send(JSON.stringify({"Msg":"Hello Anta"}));
});

routes.post('/gps',mw.gpsStore,function(req,res){
    console.log("Probably Done?");
    res.send("Done...");
});

module.exports = routes;
