var pgclient = require('../models/pgclient');
var as  = require('async');
var user = {
    'is_user' : function(user,cb){
        pgclient.execute(`select count(*) from users where phone = '${user}'`,
        function(err,result){
            if(err){
                cb(err);
            }else if(result&&result.length){
                if(result[0].count=='0')
                cb(null,false);
                else cb(null,true);
            }
        });
    },
    'are_users' : function(users,cb){
        as.map(users,user.is_user,cb);
    },
    'filterUsers' : function(users,cb){
        as.filter(users,user.is_user,function(err,u){
            if(err)cb(err);
            else{
                as.reject(users,user.is_user,function(err,nu){
                    if(err)cb(err);
                    else{
                        cb(null,{'u':u,'nu':nu});
                    }
                });
            }
        });
    }
}

module.exports = user;

//-------------------------------------------

if(require.main===module){
    (function(){
        user.filterUsers(['1234567890','918566','123','2313211212122'],function(err,result){
            if(err)console.log(err);
            else console.log(result);
        })
    })();
}