const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/keys');
passport.use(
    new GoogleStrategy({
        callbackURL: '/auth/google/callback',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    }, (req, accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    })
);
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
