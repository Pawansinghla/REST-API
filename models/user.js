var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var passportLocalMongoose=require('passport-local-mongoose');

//username and password is automatic added in passport-local-mongoose plugin

var User=new Schema({
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },
    admin:{
        type:Boolean,//by default user will not be admin, you can set explicitly  a particular user as a admin 
        default:false
    }
});
User.plugin(passportLocalMongoose);//add pass, username

module.exports=mongoose.model('User',User)