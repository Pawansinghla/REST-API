const express=require('express');
const bodyparser=require('body-parser');


const promoRouter=express.Router();
promoRouter.use(bodyparser.json());

promoRouter.route('/')
.all((req,res,next)=>{ // it will execute by default first
    res.statusCode=200;
    res.setHeader('Content-type','text/plain');
    next();//  it means it will continue to  look for addition spceification down below 
  })
  
  .get((req,res,next)=>{//modify res,req come from above
    res.end('will send all the  promo to you');
  })
  
.post((req,res,next)=>{//same
    res.end('Will add the promotions: '+req.body.name+ 
    ' With details: '+req.body.description);
  })
  
  .put((req,res,next)=>{
    res.statusCode=403;
    res.end('Put operation not supported on /promotions');
  
  })
.delete((req,res,next)=>{
    res.end('Deleting all the promotions!');
  
  });

  promoRouter.route('/:promoId').all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
  })
  .get((req,res,next)=>{
    res.end('will send details of the promotion with id : ' + req.params.promoId);
  })
  .post((req,res,next)=>{
    res.statusCode = 403;
    res.end('post to /promotions/' + req.params.promoId + ' is forbidden');
  })
  .put((req,res,next)=>{
    res.end('promotions with id : ' + req.params.promoId + ' will be updated with name: ' + req.body.name +' and description: '+req.body.description);
  })
  .delete((req,res,next)=>{
    res.end('deleting promotion with id : '+ req.params.promoId);
  });


  





module.exports=promoRouter;