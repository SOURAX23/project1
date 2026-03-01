const { required } = require('joi');
const mongoose=require('mongoose');
const passportLocalMongoose= require('passport-local-mongoose').default;
const Schema=mongoose.Schema;


const userSchema=new Schema({
    email:{
        type:String,
        
    }
});

userSchema.plugin(passportLocalMongoose);// for addding username abd password with hashing and salting

module.exports=mongoose.model("User",userSchema);

