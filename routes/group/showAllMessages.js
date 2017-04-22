"use_strict";

var message=require('../../lib/message');
var butils=require('../../lib/butils');


var showAllMessages=function(req,res){

  var resp = {'status':'fail','err':'','resp':[]};
  var phone=req.data.phone || '';
  
  var token=req.data.token || '';

  var gid=req.data.gid || '';

  var latLong = butils.cleanLatLong(req.data.coord[0], req.data.coord[1]);

  if(phone && token && gid && latLong )
  {
     message.getMessagesForGroupSolr(gid,latLong,function(err,result){
      if(!err)
      {
          resp.status='success';
          resp.resp=result;

      }
        else {
        console.log(`[ERROR user/showAllMessages] for ${phone}: ${err}`);
        resp.err = err;
      }
      res.json(resp);
    });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR user/showAllMessages] Invalid parameters for ${phone}`)
    res.json(resp);
  }
};

module.exports = showAllMessages;
     