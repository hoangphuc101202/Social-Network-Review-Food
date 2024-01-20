const express = require('express');
const Router = express.Router();
const {verifyAccessToken} = require('../controller/authController');
const {homeController,SinglePostController,getUserController,searchAll} = require('../controller/homeController');
const {categoryController,  getPostFromCategory} = require('../controller/categoryController');
const {getSingleUserFollow} = require('../controller/followerController');
const passport = require('passport');
Router.get('/home',verifyAccessToken, homeController);
Router.get('/category',verifyAccessToken, categoryController)
Router.get('/category/:categoryName',verifyAccessToken,getPostFromCategory)
Router.get('/single-post/:id',verifyAccessToken,SinglePostController);
Router.get('/user/:id',verifyAccessToken,getUserController);
Router.get('/user-following/:id',verifyAccessToken,getSingleUserFollow);
Router.post('/search-all',verifyAccessToken,searchAll)
module.exports = Router;