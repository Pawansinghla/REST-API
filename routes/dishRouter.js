const express=require('express');
const bodyParser=require('body-parser');

const dishRouter=express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')

.all((req,res,next)=>{ // it will execute by default first
    res.statusCode=200;
    res.setHeader('Content-type','text/plain');
    next();//  it means it will continue to  look for addition spceification down below 
  })
  
  .get((req,res,next)=>{//modify res,req come from above
    res.end('will send all the dishes to you');
  })
  
.post((req,res,next)=>{//same
    res.end('Will add the dish: '+req.body.name+ 
    ' With details: '+req.body.description);
  })
  
  .put((req,res,next)=>{
    res.statusCode=403;
    res.end('Put operation not supported on /dishes');
  
  })
.delete((req,res,next)=>{
    res.end('Deleting all the dishes!');
  
  });

  dishRouter.route('/:dishId').all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
  })
  .get((req,res,next)=>{
    res.end('will send details of the dish with id : ' + req.params.dishId);
  })
  .post((req,res,next)=>{
    res.statusCode = 403;
    res.end('post to /dishes/' + req.params.dishId + ' is forbidden');
  })
  .put((req,res,next)=>{
    res.end('dish with id : ' + req.params.dishId + ' will be updated with name: ' + req.body.name +' and description: '+req.body.description);
  })
  .delete((req,res,next)=>{
    res.end('deleting dish with id : '+ req.params.dishId);
  });


  
  

  module.exports=dishRouter;