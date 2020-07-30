const express=require('express');
const cors=require('cors');
const app=express();


const whitelits=['http://localhost:3000','https://localhost:3443','http://DESKTOP-6JVQ2KC:3001']//for yarn start i added computername

var corsOptionsDelegate=(req,callback)=>{
    var corsOptions;
    if(whitelits.indexOf(req.header('Origin'))!=-1){
        corsOptions={origin:true};
    }
    else{
        corsOptions={origin:false}
    }
    callback(null,corsOptions);

};

exports.cors=cors();//if you configure cors module by cors , this will reply with access-control-allow-origin, mostly  in get
exports.corsWithOptions=cors(corsOptionsDelegate); // with corsoptions , restrciont

