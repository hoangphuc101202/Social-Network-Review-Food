const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    title : {
        type : String
    }
    ,
    image: {
        type: String
    },
    content: {
        type: String
    },
    createdAt: {
        type: Date,
        default : Date.now
    },
    like:  [{type: Schema.Types.ObjectId, ref: 'User'}]
    ,
    comment:  [{type: Schema.Types.ObjectId, ref: 'User'}],
    category : {
        type: String
    }    
});

const postModel = mongoose.model('Post', postSchema);
module.exports = postModel;