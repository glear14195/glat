"use_strict";

var user=require('../../lib/user');
var butils=require('../../lib/butils');


var groupListView=function(req,res){

  var resp = {'status':'fail','err':'','resp':[]};
  var phone=req.data.phone;
  
  var token=req.data.token; 

  var latLong = butils.cleanLatLong(req.data.coord[0], req.data.coord[1]);

  if(phone && latLong) {
      user.getGroupsList(phone,latLong,function(err,result){
      if(!err)
      {
          resp.status='success';
          resp.resp=result;

      }
        else {
        console.log(`[ERROR user/groupListView] for ${phone}: ${err}`);
        resp.err = err;
      }
      res.json(resp);
    });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR user/groupListView] Invalid parameters for ${phone}`)
    res.json(resp);
  }
};

module.exports = groupListView;
     