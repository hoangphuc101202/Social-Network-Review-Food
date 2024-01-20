const userModel = require('../model/usersModel');
const createError = require('http-errors');
const bcryptjs = require('bcryptjs');
const {getUsersByID,updateUsers} = require('../queries/usersQueries')
const {getCountFollowOfUser, getFourFollowedOfUser, UserFollowingCount} = require('../controller/followerController');
const {addPost, getPostOfUsers, CountPostOfUsers, PostDelete, updatePost} = require('../queries/postQueries')
module.exports = {
    getUserToEdit : async (req,res,next) => {
        const userToEdit = await getUsersByID(req.params.id);
        res.render('editUser', {
            users: userToEdit,
            idGoogle: userToEdit.googleId
        })
    },
    editUsers : async (req,res,next) => {
        try {
        const id = req.params.id;
        const {fullname, email, phone, dob, gender} = req.body;
        let file = req.file;
        let hinhanh = null;
        if(!file) {
            hinhanh = req.body.hinhanh;
        }
        else{
            hinhanh = file.filename
        }
        const usersUpdated = await updateUsers(fullname, email, phone, dob, gender,hinhanh, id);
        if(usersUpdated) {
            res.redirect(`/users/edit-user/${id}`);
        }
        else{
            res.status(500).send("Có lỗi xảy ra khi cập nhật thông tin người dùng.");
        }
        } catch (error) {
            console.log(error);
        }
        
    },
    getUserToMyPost : async (req,res,next) => {
        try{
            const userToMyPost = await getUsersByID(req.params.id);
            const postOfUsers = await getPostOfUsers(req.params.id);
            const countPost = await CountPostOfUsers(req.params.id);
            const countFollowing = await getCountFollowOfUser(req.params.id);
            const FourUserFollowed = await getFourFollowedOfUser(req.params.id);
            const countFollowed = await UserFollowingCount(req.params.id);
            res.render('myPost', {
                UserFollowedRender :  FourUserFollowed,
                countFollowed: countFollowed,
                countFollower: countFollowing,
                users: userToMyPost,
                posts: postOfUsers,
                count : countPost
            })
        }
        catch (error) {
            console.log(error.message);
        }
    },
    addPost : async (req,res,next) => {
        try {
            const idAuthor = req.params.id;
            const {postTitle, postContent, city} = req.body;
            let files = req.file;
            let image = null;
            if(!files) {
                image = req.body.valueImage;
            }  
            else{
                image = files.filename;
            }
            const newPost = await addPost(idAuthor, postTitle, postContent, city, image);
            if(newPost){
                res.redirect(`/users/mypost/${idAuthor}`)
            }
            else{
                res.status(500).send("Có lỗi xảy ra khi thêm bài viết");
            }
        }
        catch (error) {
            if(error.details === true) {
                error.status = 422;
                return;
            }    
            if (error instanceof createError.HttpError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An internal server error occurred' });
            }
        }
    },
    deletePost : async (req,res,next) => {
        try{
            const idUser = req.params.idUser;
            const idPost = req.params.idPost;
            const result = await PostDelete(idPost);
            if(result) {
                res.redirect(`/users/mypost/${idUser}`)
            }
            else{
                res.status(500).send("Có lỗi xảy ra khi Xóa bài viết");
            }
        }
        catch (error) {
            if(error.details === true) {
                error.status = 422;
                return;
            }    
            if (error instanceof createError.HttpError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An internal server error occurred' });
            }
        }
    },
    editPost: async (req,res,next) => {
        try{
            const idPost = req.params.idPost;
            const idUser = req.params.idUser;
            const previousImage = req.body.valueImage;
            let files = req.file;
            let imageUpdated = null;
            if(!files){
                imageUpdated = previousImage;
            }
            else{
                imageUpdated = files.filename;
            }
            const {postTitleEdit, postContentEdit, cityEdit} = req.body;
            const data = await updatePost(idPost, postTitleEdit, postContentEdit, cityEdit,imageUpdated);
            if(data) {
                res.redirect(`/users/mypost/${idUser}`)
            }else{
                res.status(500).send("Có lỗi xảy ra khi Sửa bài viết");
            }
            
        }
        catch (error){
            if(error.details === true) {
                error.status = 422;
                return;
            }    
            if (error instanceof createError.HttpError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An internal server error occurred' });
            }
        }
    },
    editPassword: async (req,res,next) => {
        const idUser = req.params.id;
        const newPassword = req.body.password;
        const hashNewPass = await bcryptjs.hash(newPassword, 10);
        const passwordUpdated = await userModel.updateOne(
            {_id: idUser },
            {
                $set: {
                    password: hashNewPass
                }
            }
        )
        if(passwordUpdated) {
            res.redirect(`/users/edit-user/${idUser}`);
        }
        else{
            res.status(500).send("Có lỗi xảy ra khi cập nhật mật khẩu");
        }
    }

}