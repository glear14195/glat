"use_strict";

var message=require('../../lib/message');



var displayMessageFeed=function(req,res){

  var resp = {'status':'fail','err':'','resp':[]};
  var uid=req.data.phone;
  
  var token=req.data.token;

  var gid=req.data.gid;

  var mid=req.data.mid;

  if( token && gid && mid && uid)
  {
     message.getMessageFeed(gid,mid,function(err,result){
      if(!err)
      {
          resp.status='success';
          resp.resp=result;

      }
        else {
        console.log(`[ERROR user/displayMessageFeed] for ${uid}: ${err}`);
        resp.err = err;
      }
      res.json(resp);
    });
  } else {
    resp.err = 'Missing arguments';
    console.log(`[ERROR user/displayMessageFeed] Invalid parameters for ${uid}`)
    res.json(resp);
  }
};

module.exports = displayMessageFeed;
     