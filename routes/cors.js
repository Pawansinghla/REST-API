const express=require('express');
const cors=require('cors');
const app=express();


const whitelits=['http://localhost:3000','https://localhost:3443']

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

