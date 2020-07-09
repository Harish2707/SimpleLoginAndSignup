var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user')

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.Google_ClientID,
    clientSecret: process.env.Google_clientSecret,
    callbackURL: `${process.env.CLIENT_URL}${process.env.PORT}/auth/google/callback`
},
    function (token, refreshToken, profile, done) {

        process.nextTick(function () {
            User.findOne({ 'email': profile.emails[0].value }, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.id = profile.id;
                    newUser.name = profile.displayName;
                    newUser.email = profile.emails[0].value;
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));
