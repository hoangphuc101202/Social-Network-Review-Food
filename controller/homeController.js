const userModel = require('../model/usersModel');
const unidecode = require('unidecode');
const  { postData, postDataWithID, commentWithPostId } = require('../queries/postQueries');
const {imageUsers} = require('../queries/authQueries');
const {getUsersByID} = require('../queries/usersQueries')
const {getPostOfUsers, CountPostOfUsers} = require('../queries/postQueries')
const {checkFollowing, getCountFollowOfUser,getFourFollowedOfUser,UserFollowingCount} = require('../controller/followerController');
const postModel = require('../model/postModel');
module.exports = {
    homeController : async (req,res, next) => {
        const data = await postData();
        let city = '';
        let showLogin  = false;
        const payload = req.payload;
        if(!payload){
            showLogin = true
            res.render('home', {showLogin: showLogin, data, city});
        }
        else{
            const {imageUser, _id} = await imageUsers(payload.email);
            const idUser = _id.toString()
            res.render('home', 
            {   data,
                city,
                showLogin: showLogin,
                usersId : idUser,
                userImage : imageUser,
                userFullName : payload.fullname
            })
        }
       
    },
    SinglePostController : async(req,res,next) => {
        const idPost = req.params.id;
        const data = await postDataWithID(idPost);
        const dataComment = await commentWithPostId(idPost);
        let showLogin  = false;
        let showComment = false;
        const payload = req.payload;
        if(!payload){
            showLogin = true
            res.render('single-post', {showComment,showLogin: showLogin, data,comment: dataComment});
        }
        else{
            const {imageUser, _id} = await imageUsers(payload.email);
            const idUser = _id.toString()
            showComment = true;
            res.render('single-post', 
            {   data,
                showComment,
                comment: dataComment,
                showLogin: showLogin,
                usersId : idUser,
                userImage : imageUser,
                userFullName : payload.fullname
            })
        }
    },
    getUserController : async (req,res,next) => {
        const userID = req.params.id;
        let showLogin = false;
        let isFollow = false;
        const dataUser = await getUsersByID(userID);
        const postOfUsers = await getPostOfUsers(userID);
        const countPost = await CountPostOfUsers(userID);
        const payload = req.payload; 
        const countFollowing = await getCountFollowOfUser(userID);
        const FourUserFollowed = await getFourFollowedOfUser(userID);
        const countFollowed = await UserFollowingCount(userID);
        
        if(!payload){
            showLogin = true
            res.render('single-user', {showLogin: showLogin,
                UserFollowedRender :  FourUserFollowed,
                countFollower : countFollowing,
                countFollowed: countFollowed,
                isfollow: isFollow,
                data: dataUser,
                posts: postOfUsers,
                count: countPost});
        }
        else{
            const idUserFollower = await userModel.findOne({email: payload.email}).select('_id');
            if(payload.email === dataUser.email){
                res.render('myPost', {
                    UserFollowedRender :  FourUserFollowed,
                    countFollower : countFollowing,
                    countFollowed: countFollowed,
                    users: dataUser,
                    posts: postOfUsers,
                    count : countPost
                })
                return;
            }
            const followerRecord = await checkFollowing(userID,idUserFollower);
            if(followerRecord) {
                isFollow = true;
            }
            
            const {imageUser, _id} = await imageUsers(payload.email);
            const idUser = _id.toString()
            res.render('single-user', 
            {   
                UserFollowedRender :  FourUserFollowed,
                countFollower : countFollowing,
                data: dataUser,
                countFollowed: countFollowed,
                showLogin: showLogin,
                isfollow : isFollow,
                posts: postOfUsers,
                count: countPost,
                usersId : idUser,
                userImage : imageUser,
                userFullName : payload.fullname
            })
        }
    },
    searchAll: async (req, res, next) => {
        const { search } = req.body;
        const regex = new RegExp(search, 'i');
        const resultUserData = await userModel.find({ fullname: regex });
        const resultPostData = await postModel.find({ title: regex }).populate('author', 'fullname');
        let showLogin = false;
        let showNotResult = false;  // Đặt ban đầu là false
        if (resultUserData.length > 0 || resultPostData.length > 0) {
            const payload = req.payload;
            if (!payload) {
                showLogin = true;
                res.render('search', {
                    showLogin: showLogin,
                    user: resultUserData,
                    post: resultPostData,
                    showResult: showNotResult
                });
            } else {
                const { imageUser, _id } = await imageUsers(payload.email);
                const idUser = _id.toString();
                res.render('search', {
                    showLogin: showLogin,
                    usersId: idUser,
                    userImage: imageUser,
                    userFullName: payload.fullname,
                    user: resultUserData,
                    post: resultPostData,
                    showResult: showNotResult
                });
                }
            }
            else{
                showNotResult = true;
                const payload = req.payload;
                if (!payload) {
                    showLogin = true;
                    res.render('search', {
                        showLogin: showLogin,
                        user: resultUserData,
                        post: resultPostData,
                        showResult: showNotResult
                    });
                } else {
                    const { imageUser, _id } = await imageUsers(payload.email);
                    const idUser = _id.toString();
                    res.render('search', {
                        showLogin: showLogin,
                        usersId: idUser,
                        userImage: imageUser,
                        userFullName: payload.fullname,
                        user: resultUserData,
                        post: resultPostData,
                        showResult: showNotResult
                    });
                }
            }
        
        
    }
    
} 