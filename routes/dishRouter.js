const express=require('express');
const bodyParser=require('body-parser');

const mongoose =require('mongoose');

const Dishes=require('../models/dishes');

const dishRouter=express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')

// .all((req,res,next)=>{ // it will execute by default first
//     res.statusCode=200;
//     res.setHeader('Content-type','text/plain');
//     next();//  it means it will continue to  look for addition spceification down below 
//   })
  
  .get((req,res,next)=>{//modify res,req come from above
   Dishes.find({})
    .then((dishes)=>{
      res.statusCode=200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);

    },(err)=>next(err))
    .catch((err)=>next(err));
  })
  
.post((req,res,next)=>{//same
   Dishes.create(req.body)
   .then((dish)=>{
     console.log('Dish Created',dish);
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(dish);
   },(err)=>next(err))

   .catch((err)=>next(err));
  })
  
  .put((req,res,next)=>{
    res.statusCode=403;
    res.end('Put operation not supported on /dishes');
  
  })
.delete((req,res,next)=>{
    Dishes.remove({})
    .then((resp)=>{
      res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(resp);
   },(err)=>next(err))

   .catch((err)=>next(err));
  
  });

  dishRouter.route('/:dishId')
  // .all((req,res,next)=>{
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type','text/plain');
  //   next();
  // })
  .get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
      res.statusCode=200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);

    },(err)=>next(err))
    .catch((err)=>next(err));
  })

  .post((req,res,next)=>{
    res.statusCode = 403;
    res.end('post to /dishes/' + req.params.dishId + ' is forbidden');
  })
  .put((req,res,next)=>{
    Dishes.findByIdAndUpdate(req.param.dishId,{
      $set:req.body
    },{new :true})
    .then((dish)=>{
      res.statusCode=200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);

    },(err)=>next(err))
    .catch((err)=>next(err));
  })

  .delete((req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
      res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(resp);
   },(err)=>next(err))

   .catch((err)=>next(err));
   
  });


  
  

  module.exports=dishRouter;