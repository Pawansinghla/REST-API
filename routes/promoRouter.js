const express=require('express');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');

const Promotions=require('../models/promotions');
const authenticate=require('../authenticate');
const cors=require('./cors');
const promoRouter=express.Router();
promoRouter.use(bodyparser.json());

promoRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req, res, next) => {//modify res,req come from above
Promotions.find(req.query)
    .then((promotions) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotions);

    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {//same
  Promotions.create(req.body)
    .then((promotion) => {
      console.log('Promotion Created', promotion);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
    }, (err) => next(err))

    .catch((err) => next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('Put operation not supported on /promotions');

})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
  Promotions.remove({})
    .then((promotion) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
    }, (err) => next(err))

    .catch((err) => next(err));
  
  });




  promoRouter.route('/:promoId')
  .options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
  .get(cors.cors,(req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);

      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('post to /promotions/' + req.params.promoId + ' is forbidden');
  })
  .put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Promotions.findByIdAndUpdate(req.param.promoId, {
      $set: req.body
    }, { new: true })
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);

      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))

      .catch((err) => next(err));

  });


  


module.exports=promoRouter;