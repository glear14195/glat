var User=require('../../models/users');

var updateProfile= function(req,res){

    var resp= {'status':'fail','err':'','resp':[]};

    var phone=req.data.phone || '';
    var name=req.data.name || '';
    var picLoc=req.data.picLoc || '';
    var token = req.data.token;

    if(phone && name && picLoc && token) {
      User.update({
      where : {
           phone: phone
        }
       }, {
           dname: name,
           pic_location: picLoc
       },
           function(err, result){
              if (!err) {
                resp.status = 'success';
                resp.resp = 'Profile updated';
            } 
            else {
               console.log(`[ERROR user/updateProfile] for ${phone}: ${err}`);
               resp.err = err;
            }

      res.json(resp); 
     });

    }
    else {
       resp.err = 'Missing arguments';
       console.log(`[ERROR user/updateProfile] Invalid parameters for ${phone}`)
       res.json(resp);
  }

};

module.exports = updateProfile
