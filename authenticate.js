var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;

var User=require('./models/user');
exports.local=passport.use(new LocalStrategy(User.authenticate()));//automatic autheticate if we will use mongoose plugin , otherwise we need to write authentication function
passport.serializeUser(User.serializeUser());//provide schema and models and support for session
passport.deserializeUser(User.deserializeUser());