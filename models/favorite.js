const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const favoritesSchema=new Schema({
    user: {
       
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
     },
    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dish'
    }],
    
    },

     {
        timestamps: true
    }
);


var Favorites=mongoose.model('Favorites',favoritesSchema);
module.exports=Favorites;
