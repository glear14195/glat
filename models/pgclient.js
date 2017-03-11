var conf = require('../config').pg_conn_string;

var pg = require('pg');

//switch to pool???
var pgclient={
    execute : function(query,cb){
        var client = new pg.Client(conf);
        client.connect(function (err) {
            if (err) cb('conn_error',null);
            else {
                   client.query(query, function (err, result) {
                       client.end();
                        if (err){
                            console.log("Error in query execution: "+err+" query : "+query);
                            cb('execution_error');
                        }
                        else cb(null,result.rows); 
                    });
            }
         
        });

    }

}
module.exports = pgclient;