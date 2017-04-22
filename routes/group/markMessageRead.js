var MessageLog=require('../../models/message_log');

var markMessageRead= function(req,res){

    var resp= {'status':'fail','err':'','resp':[]};

   
    var gid=req.data.gid || '';
    var uid=req.data.phone || '';
     var mid=req.data.mid || '';
    var token = req.data.token;

    if( gid && uid && mid && token) {
      MessageLog.update({
      where : {
           status: 0,
           gid: gid,
           uid: uid,
           mid: mid
        }
       }, {
           status: 1,
           modified_time : Date.now
       },
           function(err, result){
              if (!err) {
                resp.status = 'success';
                resp.resp = 'Message in Read status';
            } 
            else {
               console.log(`[ERROR user/markMessageRead] for ${phone}: ${err}`);
               resp.err = err;
            }

      res.json(resp); 
     });

    }
    else {
       resp.err = 'Missing arguments';
       console.log(`[ERROR user/markMessageRead] Invalid parameters for ${phone}`)
       res.json(resp);
  }

};

module.exports = markMessageRead
