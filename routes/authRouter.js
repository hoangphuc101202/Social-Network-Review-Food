const express = require('express');
const Router = express.Router();
const {loginWithGoogle,loginUsers, registerUsers, logoutUser, forgetPassword,verifyforgetPassword,resetPassword} = require('../controller/authController');
const passport = require('passport');
Router.get('/login',(req,res) => {
    
    res.render('login',
     { registerSuccess: req.flash('registerSuccess'),
        Invalid_Email: req.flash('Invalid_Email'),
        Invalid_Password: req.flash('Invalid_Password'),
        Password_Updated: req.flash('Password_Updated')
    });
});
Router.post('/login',loginUsers);
Router.get('/register',(req,res,next) => {
    res.render('register', {
        exist_message: req.flash('existEmail'),
    });
})
Router.post('/register', registerUsers);
Router.get('/logout',logoutUser);
Router.get('/forget', (req,res,next) =>{
    res.render('forget', {
        Invalid_Email: req.flash('Invalid_Email'),
        Email_Send: req.flash('Email_Send')
    });
});
Router.post('/forget',forgetPassword);
Router.get('/verify/*',verifyforgetPassword);
Router.post('/reset-password',resetPassword);
Router.get('/google',passport.authenticate('google', {
    scope: ['profile','https://www.googleapis.com/auth/userinfo.email']
}));
Router.get('/google/callback', passport.authenticate('google'), loginWithGoogle);

module.exports = Router;