const express = require('express');
const Router = express.Router();
const {verifyAccessToken} = require('../controller/authController')
const { getUserToEdit, editUsers,getUserToMyPost,addPost,deletePost,editPost, editPassword} = require('../controller/userController');
const {addfollower,deleteFollower,getFollowingOfUser} = require('../controller/followerController');
const {addComment} = require('../controller/commentController');
const {getAllNotification} = require('../controller/notiController');
const {upload} = require('..');
Router.get('/edit-user/:id',verifyAccessToken, getUserToEdit);
Router.post('/edit-user/:id',upload.single('hinhanh'), editUsers)
Router.post('/edit-password/:id',verifyAccessToken,editPassword);
Router.get('/mypost/:id',verifyAccessToken,getUserToMyPost);
Router.get('/following/:id',verifyAccessToken,getFollowingOfUser)
Router.post('/addPost/:id',upload.single('image'),addPost);
Router.get('/deletePost/:idUser/:idPost',verifyAccessToken,deletePost);
Router.post('/edit-post/:idUser/:idPost', upload.single('imageEdit'), editPost);
Router.post('/follow/:id',verifyAccessToken,addfollower);
Router.delete('/deletefollow/:id',verifyAccessToken,deleteFollower);
Router.post('/addComment/:id',verifyAccessToken, addComment);
Router.get('/noti',verifyAccessToken,getAllNotification);
module.exports = Router;
