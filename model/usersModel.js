const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {   
        email: {
            type: String, 
            required: true
        },
        password: {
            type : String
        },
        fullname: {
            type : String,
            required: true
        },
        birthday: {
            type : Date
        },
        gender: {
            type: String
        },
        phone: {
            type: Number
        },
        imageUser: {
            type: String
        },
        posts: {
            type: [{type: Schema.Types.ObjectId, ref: 'Post'}]
        },
        Address:{
            type: String
        },
        googleId:{
            type: String
        }
        
    }
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;