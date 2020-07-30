const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Favorites = require('../models/favorite');

var authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
    .get(cors.cors, authenticate.verifyUser,(req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                if (favorite != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                   
                    res.json(favorite);
                }
                else {
                    err = new Error('You do not have any favorite dishes');
                    err.status = 400;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));

    })

    .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Favorites.findOne({ user: req.user_id })
            .then((favorite) => {
                if (favorite != null) {
                    req.body.forEach((dish) => {
                        if (favorite.dishes.indexOf(dish) === -1) {
                            favorite.dishes.push(dish._id);
                        }
                        else {
                            err = new Error("This dish with id: " + dish._id + " already exists");
                            err.status = 403;
                            return next(err);

                        }
                    });
                    favorite.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite)=>{
                           res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);


                            },(err)=>next(err))
                            
                        }, (err) => next(err))
                        .catch((err)=>next(err));
                }
                else {
                    Favorites.create({ user: req.user._id })
                        .then((favorite) => {
                            req.body.forEach(dish => favorite.dishes.push(dish._id));
                            favorite.save()
                                .then((favorite) => {
                                    Favorites.findById(favorite._id)
                                    .populate('user')
                                    .populate('dishes')
                                    .then((favorite)=>{
                                   res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                }, (err) => next(err));
                        }, (err) => next(err))
                        .catch((err) => next(err));
                },(err)=>next(err))
                .catch((err)=>next(err))
            }
        },(err)=>next(err))
        .catch((err)=>next(err));
            

    })
    .put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites ');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Favorites.remove({ user: req.user._id })
            .then((resp) => {

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);

            }, (err) => next(err))
            .catch((err) => next(err));

    });

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
    .get(cors.cors, authenticate.verifyUser,(req, res, next) => {
        Favorites.findOne({user:req.user._id})
        .then((Favorites)=>{
            if(!Favorites){
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                return res.json({"exists":false,'favorites':favorites})
            }
            else{
                if(favorites.dishes.indexOf(req.params.dishId)<0){
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    return res.json({"exists":false,'favorites':favorites})
                }
                else{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    return res.json({"exists":true,'favorites':favorites})
                }
            }

        },(err)=>next(err))
        .catch((err)=>next(err))

    })
    .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Favorites.findOne({ user: req.user_id },(err,favorite))
        if(err) return next(err);

                if(!favorite){
                    Favorites.create({ user: req.user._id })
                        .then((favorite) => {
                            favorite.dishes.push(req.params.dishId);
                            favorite.save()
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                }, (err) => next(err))
                                .catch((err)=>next(err));
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else{
                    if (favorite.dishes.indexOf(req.params.dishId)=== -1) {
                        favorite.dishes.push(dish._id);
                        favorite.save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite)=>{
                               res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
    
    
                                },(err)=>next(err))
                               

                            }, (err) => next(err));
                    }
                    else {
                        err = new Error("This dish with id: " + req.params.dishId + " already exists");
                        err.status = 403;
                        return next(err);

                    }

                }
            

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites/' + req.params.dishId);
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                var index=favorite.dishes.indexOf(req.params.dishId);
                if (index>-1) {
                    favorite.dishes.splice(index,1);
                    favorite.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite)=>{
                           res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);


                            },(err)=>next(err))
                        }, (err) => next(err));
                }
                else {
                    err = new Error('The dish with the id: ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));

    })


module.exports = favoriteRouter;