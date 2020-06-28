var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var User=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,


    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,//by default user will not be admin, you can set explicityle a particular user as a admin 
        default:false
    }
})

module.exports=mongoose.model('User',User)