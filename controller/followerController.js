const followerModel = require('../model/followModel');
const userModel = require('../model/usersModel');
const {getUsersByID} = require('../queries/usersQueries');
const {CountPostOfUsers} = require('../queries/postQueries');
const {imageUsers} = require('../queries/authQueries');
const {createFollowNotification} = require('../controller/notiController');
module.exports = {
    addfollower : async (req,res,next) => {
        if (!req.payload || !req.payload.email) {
            return res.status(401).send('Unauthorized: Login required');
        }
        const idUserFollowed = req.params.id;
        const idUserFollower = await userModel.findOne({email: req.payload.email}).select('_id');
        const userFollower = new followerModel({
            followerId: idUserFollower,
            followedId: idUserFollowed
        })
        await userFollower.save();
        await createFollowNotification(idUserFollowed,idUserFollower);
        return res.status(200).send('Đã Theo Dõi người này');       
    },
    checkFollowing : async (idUser,idUserFollower) => {
        const followerRecord = await followerModel.findOne({followerId: idUserFollower,
        followedId: idUser})
        return followerRecord;
    },
    deleteFollower : async (req,res,next) => {
        const idUserFollowed = req.params.id;
        const idUserFollower = await userModel.findOne({email: req.payload.email}).select('_id');
        const result = await followerModel.deleteOne({followerId: idUserFollower, followedId: idUserFollowed })
        if(result.deletedCount === 1) {
            res.status(200).send('Đã Xóa thành công');
        }
    },
    getCountFollowOfUser : async (idUsers) => {
        const count = await followerModel.countDocuments({followerId: idUsers});
        return count;
    },
    getFourFollowedOfUser : async (idUsers) => {
        const userFollowed = await followerModel.find({followerId: idUsers}).populate('followedId', 'fullname imageUser').limit(4);
        return userFollowed;
    },
    getFollowingOfUser : async (req,res,next) => {
        const userToMyPost = await getUsersByID(req.params.id);
        const countPost = await CountPostOfUsers(req.params.id);
        const idUsers = req.params.id;
        const userFollowing = await followerModel.find({followerId: idUsers}).populate('followedId', 'fullname imageUser')
        res.render('follower', {
            users: userToMyPost,
            count : countPost,
            following: userFollowing
        })
    },
    getSingleUserFollow : async (req,res,next) => {
        const userID = req.params.id;
        let showLogin = false;
        let isFollow = false;
        const dataUser = await getUsersByID(userID);
        const countPost = await CountPostOfUsers(userID);
        const userFollowing = await followerModel.find({followerId: userID}).populate('followedId', 'fullname imageUser')
        const payload = req.payload; 
        if(!payload){
            showLogin = true
            res.render('user-following', {showLogin: showLogin,
                isfollow: isFollow,
                data: dataUser,
                count: countPost,
                following: userFollowing 
                });
        }
        else{
            const idUserFollower = await userModel.findOne({email: payload.email}).select('_id');
            const followerRecord = await module.exports.checkFollowing(userID, idUserFollower);
            if(followerRecord) {
                isFollow = true;
            }
            
            const {imageUser, _id} = await imageUsers(payload.email);
            const idUser = _id.toString()
            res.render('user-following', 
            {   
                data: dataUser,
                showLogin: showLogin,
                isfollow : isFollow,
                count: countPost,
                usersId : idUser,
                userImage : imageUser,
                userFullName : payload.fullname,
                following: userFollowing 
            })
        }
    },
    UserFollowingCount: async (userId) =>{
        const userFollowing = await followerModel.countDocuments({followedId: userId});
        return userFollowing;
    }
  
}