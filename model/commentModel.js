const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    post : {type: Schema.Types.ObjectId, ref: 'Posts'},
    content: {
        type: String
    },
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    replies: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    createdAt : {
        type: Date,
        default : Date.now
    },
});
const commentModel = mongoose.model('Comment', commentSchema);
module.exports = commentModel;