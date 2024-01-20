const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const followSchema = new Schema({
    followerId : {type: Schema.Types.ObjectId, ref: 'User'},
    followedId : {type: Schema.Types.ObjectId, ref: 'User'}
})

const followerModel = mongoose.model('Follower', followSchema);
module.exports = followerModel;