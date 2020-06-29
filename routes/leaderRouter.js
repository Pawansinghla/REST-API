const express=require('express');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const Leaders =require('../models/leaders');

var authenticate=require('../authenticate');

const leaderRouter=express.Router();
leaderRouter.use(bodyparser.json());

leaderRouter.route('/')

.get((req, res, next) => {//modify res,req come from above
  Leaders.find({})
      .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
  
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  
  .post(authenticate.verifyUser,(req, res, next) => {//same
    Leaders.create(req.body)
      .then((leaders) => {
        console.log('Leader Created', leaders);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
      }, (err) => next(err))
  
      .catch((err) => next(err));
  })
  
  .put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /leaders');
  
  })
  .delete(authenticate.verifyUser,(req, res, next) => {
    Leaders.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
  
      .catch((err) => next(err));
    
    });
  


    leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
      Leaders.findById(req.params.leaderId)
        .then((leader) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(leader);
  
        }, (err) => next(err))
        .catch((err) => next(err));
    })
  
    .post(authenticate.verifyUser,(req, res, next) => {
      res.statusCode = 403;
      res.end('post to /leaders/' + req.params.leaderId + ' is forbidden');
    })
    .put(authenticate.verifyUser,(req, res, next) => {
      Leaders.findByIdAndUpdate(req.param.leaderId, {
        $set: req.body
      }, { new: true })
        .then((leader) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(leader);
  
        }, (err) => next(err))
        .catch((err) => next(err));
    })
  
    .delete(authenticate.verifyUser,(req, res, next) => {
      Leaders.findByIdAndRemove(req.params.leaderId)
        .then((resp) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(resp);
        }, (err) => next(err))
  
        .catch((err) => next(err));
  
    });
  
  

module.exports=leaderRouter;