const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');

function initialize(passport, User) {
    const authenticateUser =  async (email, password, done) => {
        User.findOne({ email: email, active: true})
            .then(async user => {
                if (!user) {
                    return done(null, false, { message: "Email is not registerd or Your account is not active" })
                }
                try {        
                    if (password == user.password) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Password incorrect' })
                    }
                } catch (e) {
                    return done(e)
                }
            })
            .catch(err => Console.log(err))
        }   

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}

module.exports = initialize