const notiModel = require('../model/notificationModel');
const userModel = require('../model/usersModel');
const postModel = require('../model/postModel');
const commentModel = require('../model/commentModel');
const {io} = require('..');
module.exports = {
    createFollowNotification : async (userId, followerId) => {
        try {
            const notification = new notiModel({
                userId: userId,
                type: 'follower',
                senderId: followerId
            })
            await notification.save();
            console.log("Da tao thong bao thanh cong");
        }catch (error){
            console.log("Loi khi tao thong bao");
        }
    },
    createCommentNotification : async (userId, commentId) => {
        try{
            const commentNoti = new notiModel({
                userId: userId,
                type: 'comment',
                senderId: commentId
            })
            await commentNoti.save();
            console.log("Da tao thong bao comment");

        }
        catch (error) {
            console.log('Loi tao thong bao');
        }
    }
}