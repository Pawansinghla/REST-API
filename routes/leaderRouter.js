const express=require('express');
const bodyparser=require('body-parser');


const leaderRouter=express.Router();
leaderRouter.use(bodyparser.json());

leaderRouter.route('/')
.all((req,res,next)=>{ // it will execute by default first
    res.statusCode=200;
    res.setHeader('Content-type','text/plain');
    next();//  it means it will continue to  look for addition spceification down below 
  })
  
  .get((req,res,next)=>{//modify res,req come from above
    res.end('will send all the  leader to you');
  })
  
.post((req,res,next)=>{//same
    res.end('Will add the leader: '+req.body.name+ 
    ' With details: '+req.body.description);
  })
  
  .put((req,res,next)=>{
    res.statusCode=403;
    res.end('Put operation not supported on /leaders');
  
  })
.delete((req,res,next)=>{
    res.end('Deleting all the leaders!');
  
  });

  leaderRouter.route('/:leaderId').all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
  })
  .get((req,res,next)=>{
    res.end('will send details of the leader with id : ' + req.params.leaderId);
  })
  .post((req,res,next)=>{
    res.statusCode = 403;
    res.end('post to /leader/' + req.params.leaderId + ' is forbidden');
  })
  .put((req,res,next)=>{
    res.end('leader with id : ' + req.params.leaderId + ' will be updated with name: ' + req.body.name +' and description: '+req.body.description);
  })
  .delete((req,res,next)=>{
    res.end('deleting leader with id : '+ req.params.leaderId);
  });


  





module.exports=leaderRouter;