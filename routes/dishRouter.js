const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

var authenticate=require('../authenticate');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')

  // .all((req,res,next)=>{ // it will execute by default first
  //     res.statusCode=200;
  //     res.setHeader('Content-type','text/plain');
  //     next();//  it means it will continue to  look for addition spceification down below 
  //   })

  .get((req, res, next) => {//modify res,req come from above
    Dishes.find({})
    .populate('comments.author')
      .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);

      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        console.log('Dish Created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err))

      .catch((err) => next(err));
  })

  .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes');

  })
  .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))

      .catch((err) => next(err));

  });

dishRouter.route('/:dishId')
  // .all((req,res,next)=>{
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type','text/plain');
  //   next();
  // })
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);

      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('post to /dishes/' + req.params.dishId + ' is forbidden');
  })
  .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findByIdAndUpdate(req.param.dishId, {
      $set: req.body
    }, { new: true })
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);

      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))

      .catch((err) => next(err));

  });


dishRouter.route('/:dishId/comments')
  .get((req, res, next) => {//modify res,req come from above
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
      .then((dish) => {
        if (dish != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments);
        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err)
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          req.body.author=req.user._id;
          dish.comments.push(req.body);
          dish.save()//after save return the update dish
            .then((dish) => {
              Dishes.findById(dish._id)
              .populate('comments.author')
              .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(dish);

              })
             
            }, (err) => next(err))

        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err)
        }

      }, (err) => next(err))

      .catch((err) => next(err));
  })

  .put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes/ ' + req.params.dishId + ' /comments');

  })
  .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          for (var i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
          }
          dish.save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(dish);
            }, (err) => next(err));
        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err)
        }

      }, (err) => next(err))

      .catch((err) => next(err));

  });

//*********************************************** */

dishRouter.route('/:dishId/comments/:commentId')
  .get((req, res, next) => {//modify res,req come from above
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err)
        }
        else {
          err = new Error('Dish ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err)
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })


  .post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('post operation not supported  on /dishes/' + req.params.dishId +
      ' /comments/' + req.params.commentId);
  })

  .put(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {// we won't allowed to change authon and date, it would be static
        if (dish != null && dish.comments.id(req.params.commentId) != null ) {
          if(!req.user._id.equals(dish.comments.id(req.params.commentId).author)){
            var err=new Error('You are not authorized to delete this comment');
            err.status=403;
           return next(err);
          }
          if (req.body.rating) {
            dish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.comment) {
            dish.comments.id(req.params.commentId).comment = req.body.comment;
          }
          dish.save()
            .then((dish) => {
              Dishes.findById(dish._id)
              .populate('comments.author')
              .then((dish)=>{
              res.statusCode = 200;
              res.setHeader = ('Content-Type', 'application/json');
              res.json(dish);
              })
              

            }, (err) => next(err))

        }
        else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err)
        }
        else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err)
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .delete(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          if(!req.user._id.equals(dish.comments.id(req.params.commentId).author)){
            var err=new Error('You are not authorized to delete this comment');
            err.status=403;
           return next(err);
          }

          dish.comments.id(req.params.commentId).remove();
          dish.save()
          .then((dish) => {
            Dishes.findById(dish._id)
            .populate('comments.author')
            .then((dish)=>{
            res.statusCode = 200;
            res.setHeader = ('Content-Type', 'application/json');
            res.json(dish);
            })
         
            }, (err) => next(err));
        }

        else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err)
        }
        else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err)
        }


      }, (err) => next(err))

      .catch((err) => next(err));

  });




module.exports = dishRouter;