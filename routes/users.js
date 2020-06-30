var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var passport = require('passport');
var authenticate = require('../authenticate');


var router = express.Router();
router.use(bodyParser.json());


router.get('/', function (req, res, next) {
  res.send('respond with ');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      //   .then((user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });

      }
      else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;

        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
    
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registraion Successful! ' });
          })

        });

      }
    })

});

router.post('/login', passport.authenticate('local'),
  (req, res) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are  Successfully logged in ' });

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
