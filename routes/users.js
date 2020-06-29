var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var passport=require('passport');

var router = express.Router();
router.use(bodyParser.json());


router.get('/', function (req, res, next) {
  res.send('respond with ');
});

router.post('/signup', (req, res, next) => {
  //User.findOne({ username: req.body.username })
  User.register(new User({username:req.body.username}),
  req.body.password,(err,user)=>{
 //   .then((user) => {
   if(err){
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({err:err});

   }
      else {
        passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success:true, status: 'Registraion Successful! ' });
        })
    
      }
    })

});

router.post('/login',passport.authenticate('local'),
 (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success:true, status: 'You are  Successfully logged in ' });
 
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();//remove session at server side
    res.clearCookie('session-id');//asking to client to remove the cookie
    res.redirect('/');
  }
  else {
    var err = new Error("you are not logged in !");
    err.status = 403;
    next(err);
  }
}); 

module.exports = router;
