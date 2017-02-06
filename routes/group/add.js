var pgclient = require('../../models/pgclient');
var group = require('../../lib/group');
var user = require('../../lib/user');

var add = function(req,res){
    var resp = {'status':'fail','err':'','resp':{}};
    if(req.data&&req.data.phone&&req.data.gname&&req.data.mems){
        pgclient.execute(`select count(*) from groups where uid='${req.data.phone}' and gname = '${req.data.gname}'`,
            function(err,result){
                console.log(result[0]);
                if(err){
                    resp.err=err;
                    return res.json(resp);
                }else if(result&&result.length&&result[0].count!='0'){
                    resp.err='Group already exists';//checked conflicting groups
                    return res.json(resp);
                }
                else{
                    pgclient.execute(`insert into groups(uid,gname) values('${req.data.phone}','${req.data.gname}')`,
                        function(err,result){
                            if(err){
                                resp.err = err;
                                res.json(resp);
                            }else{
                                var added = [];
                                var not_added = req.data.mems;
                                var gid;
                                pgclient.execute(`select gid from groups where uid = '${req.data.phone}' and gname = '${req.data.gname}'`,
                                        function(err,result){
                                            if(err){
                                                resp.err=err;
                                                res.json(resp);
                                            }else{
                                                gid=result[0].gid;
                                                console.log(gid);
                                                (req.data.mems).forEach(function(num){})
                                            }
                                });
                                
                            }
                    });
                }
        });
        
    }else{
        resp.err='Missing Arguments';
        res.json(resp);
    }
}

module.exports = add;