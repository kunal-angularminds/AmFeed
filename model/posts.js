const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
        userId: {
          type: String
        },
        userName:{
          type:String
        },
        caption: {
          type: String,
          max: 500,
        },
        img: {
          type: String,
        },
        likes: {
          type: Array,
          default: [],
        },
        comments:{
          type:Array,
          default:[]
        }
});

module.exports = mongoose.model('Post', postSchema);