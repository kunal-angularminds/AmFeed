const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : {
        type:String,
        min:6,
        max:255,
        required:true
    },
    lastName:{
        type:String,
        min:6,
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
        max:255,
        required:true
    }
});

module.exports = mongoose.model('User', userSchema);