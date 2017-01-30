var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var solr = require('solr-client');
var client = solr.createClient({core:'gpsShit'});

function gpsStore(req,res,next)
{
        client.add({name_s:req.body.name, location_p: req.body.lat+","+req.body.long  },function(err,obj){
        if(err){
            console.log(err);
        }else{
            console.log('Solr response:', obj);
            client.commit(function(err,res){
                if(err) console.log(err);
                if(res) console.log(res);
            });
            next();
        }
        });
}

function getAll(req,res,next){
        var chunks = [];
        console.log(JSON.stringify("Starting getAll"));
        req.on("data",function(chunk){
            chunks.push(chunk);
        });
        req.on("end",function(){
            var buff = Buffer.concat(chunks);
            req.body = buff;
            next();
        });
        req.on("error",function(err){
            console.error(err);
            res.status(500);    
        });
}

app.use(function(req,res,next){
                    console.log(req.method+" request from "+req.ip);
                    next();
});

app.use(bodyParser.json());
app.all('/swap',function(req,res){
    console.log(req.ip+" "+req.body.name);
    res.send(JSON.stringify({"Name":req.body.age,"Age":req.body.name}));
});

app.all('/printBody',function(req,res){
    res.send(req.body);
    console.log(req.body);
});
app.all('/hello',function(req,res){
    console.log(req.ip+" "+req.body.name);
    res.send(JSON.stringify({"Msg":"Hello "+req.body.name,"Square":Math.pow(req.body.age,2)}));
});

app.all('/gps',gpsStore,function(req,res){
    console.log("Probably Done?");
    res.send("Done...");
});

app.listen('8080','0.0.0.0');
