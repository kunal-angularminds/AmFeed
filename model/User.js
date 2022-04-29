const { number } = require('joi');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        min : 6,
        max:255,
        required:true
    },
    email:{
        type:String,
        min:6,
        max:255,
        required:true
    },
    password:{
        type:String,
        min:6,
        max:255,
        required:true
    },
    bio:{
        type:String
    },
    gender:{
        type:String
    },
    dob: {
        type:Date
    },
    mobileNumber:{
        type:Number
    }
});

module.exports = mongoose.model('User', userSchema);