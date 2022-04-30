const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        min : 6,
        max:255,
        required:true
    },
    
});

module.exports = mongoose.model('User', userSchema);