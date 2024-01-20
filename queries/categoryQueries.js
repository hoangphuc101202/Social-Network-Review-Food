const postModel = require('../model/postModel');
const userModel = require('../model/usersModel');
module.exports = {
    getCategoryPost : async (city) => {
        const post = await postModel.find({category : city }).populate({path: 'author', select: 'fullname -_id'}).sort({ createdAt: -1 });;
        return post;
    }
}