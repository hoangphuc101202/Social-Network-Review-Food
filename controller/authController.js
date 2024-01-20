const {authSchema} = require ('../helper/validation_Schema');
require('dotenv').config();
const nodeMailer = require('nodemailer');
const userModel = require('../model/usersModel');
const Cryto = require('crypto-js');
const moment = require('moment');
const path = require('path');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const md5 = require('md5');
const bcryptjs = require('bcryptjs');
const redis = require('../helper/redis');
const SECRET_KEY = md5(md5('SECRET_KEY_KEYYY'));
const VERIFY_EMAIL_KEY = md5(md5('SECRET_KEY_KEY'));
const { registerQueries } = require('../queries/authQueries');
const defaultImageUser = '/image/DefaultImgaeUsers.jpg';
const passport = require('passport');
module.exports = {
    registerUsers : async(req,res) => {
        try {
        const {fullname , email, password } = req.body;
        const result = await authSchema.validateAsync({email: req.body.email, password: req.body.password})
        const doesExist = await userModel.findOne({email: result.email});
        if(doesExist) {
                req.flash('existEmail', 'Email đã tồn tại')
                res.redirect('/auth/register');
                return;
        }
        const createUsers = await registerQueries(fullname, result.email, result.password, defaultImageUser);
        if(createUsers) {
            req.flash('registerSuccess', 'Đăng Kí Thành Công');
            res.redirect('/auth/login');
            return;
        }
        }catch (error) {
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
    loginUsers: async (req,res,next) => {
       try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email : email});
        if(!user) {
            req.flash('Invalid_Email','Email Rỗng');
            res.redirect('/auth/login');
            return;
        }
        const isPasswordMatch = await bcryptjs.compare(password, user.password);
        if(!isPasswordMatch) {
            req.flash('Invalid_Password', 'Mật Khẩu không chính xác');
            res.redirect('/auth/login');
        }else{
            const userJWT = {
                email: user.email,
                fullname: user.fullname,
                birthday: user.birthday
            }
            const accesToken = await jwt.sign(userJWT, SECRET_KEY);
            res.cookie('accesToken', accesToken, {httpOnly: true});
            // const returnTo = req.session.returnTo;
            // delete req.session.returnTo;
            res.redirect('/home');
        }
       }catch(error){
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
    verifyAccessToken: async (req, res, next) => {
        // const token = req.headers.authorization.split(' ')[1];
        const token = req.cookies.accesToken; 
        // if (!token) {
        //     return res.status(401).json({ message: 'Unauthorized' });
        // }
        try {
            const decoded = jwt.verify(token, SECRET_KEY, (err, payload) => {
                req.payload = payload;
                next();
            });
            // console.log(req.headers);
            // console.log(req.headers.authorization);
            // console.log(req.payload);
        } catch (error) {
            if (error.details === true) {
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
    logoutUser : async (req,res,next) => {
        req.session.returnTo = req.headers.referer || '/home'
        const returnTo = req.session.returnTo;
        res.clearCookie('accesToken');
        res.redirect('/home');
    },
    forgetPassword : async (req,res,next) => {
        const {email} = req.body;
        const existEmail = await userModel.findOne({email: email});
        if(existEmail) {
            const data = {
                id: existEmail._id,
                expiredAt: new Date(moment().add(15, 'mins')).getTime()
            }
            const token = Cryto.AES.encrypt(JSON.stringify(data),VERIFY_EMAIL_KEY).toString();
            const link = `http://localhost:3000/auth/verify/${token}`;
            await redis.setTimeInSecond(`verifyLink:user-${existEmail._id}`, token, 15*60);
            const transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                  user: process.env.EMAIL_USERNAME,
                  pass: process.env.EMAIL_PASSWORD
                },
              });
              const info = await transporter.sendMail({
                from: '"Hệ Thống 👻 <hoangphuc1996vnvn@gmail.com>" ', // sender address
                to: email, // list of receivers
                subject: "🔄: Reset Your Password Now ", // Subject line
                text: `Click on this link to go to the password reset page
                        ${link}
                `,
              });
            req.flash('Email_Send','Link Was Send To Your Email!');
            res.redirect('/auth/forget');
        }
        else{
            req.flash('Invalid_Email','Email Không Tồn Tại');
            res.redirect('/auth/forget');
        }
    },
    verifyforgetPassword : async (req,res) =>{
        const token = req.params[0];
        const data = JSON.parse(Cryto.AES.decrypt(token, VERIFY_EMAIL_KEY).toString(Cryto.enc.Utf8));
        const checkLinkExist = await redis.get(`verifyLink:user-${data.id}`);
        if(!checkLinkExist) {
            return res.json('Link Does Not Valid');
        }
        await redis.del(`verifyLink:user-${data.id}`);
        return res.render('changePassword', {data: data.id});

    },
    resetPassword : async (req,res) => {
        try{
            const {newPassword, data} = req.body;
            const hashNewPass = await bcryptjs.hash(newPassword, 10);
            const passwordUpdated = await userModel.updateOne(
                {_id: data },
                {
                    $set: {
                        password: hashNewPass
                    }
                }
            )
            if(passwordUpdated) {
                req.flash('Password_Updated','Password Has Updated!');
                return res.redirect(`/auth/login`);
            }
        }catch{
            if (error.details === true) {
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
    loginWithGoogle: async (req, res, next) => {
        const { displayName, id } = req.user;
        const email = req.user.emails[0].value;
    
        try {
            const userExist = await userModel.findOne({ googleId: id });
    
            if (!userExist) {
                const newUser = await new userModel({
                    fullname: displayName,
                    googleId: id,
                    imageUser: defaultImageUser,
                    email: email
                }).save();
    
                const userJWT = {
                    email: newUser.email,
                    fullname: newUser.fullname,
                    birthday: newUser.birthday
                };
    
                const accesToken = await jwt.sign(userJWT, SECRET_KEY);
                res.cookie('accesToken', accesToken, {httpOnly: true});
                res.redirect('/home');
            }else{
                const userJWT = {
                    email: userExist.email,
                    fullname: userExist.fullname,
                    birthday: userExist.birthday
                };
            
                const accesToken = await jwt.sign(userJWT, SECRET_KEY);
                res.cookie('accesToken', accesToken, {httpOnly: true});
                res.redirect('/home');   
            }
    
            
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    


}