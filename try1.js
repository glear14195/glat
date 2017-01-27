var express = require('express');
var app = express();
var bodyParser = require('body-parser');


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
                    console.log("FIFIFI");
                    next();
});
app.use(bodyParser.json());
app.all('/hello',function(req,res){

    console.log(req.ip+" "+Object.keys(req.body));
    res.send("Ok");
});

app.listen('8080','0.0.0.0');
