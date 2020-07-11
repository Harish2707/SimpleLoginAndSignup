const LocalStrategy = require('passport-local').Strategy

function initialize(passport, User) {
    const authenticateUser = (email, password, done) => {
        User.findOne({ email: email, active: true})
            .then(user => {
                if (!user) {
                    return done(null, false, { message: "Email is not Registered or Your account is not Verified" })
                }
                try {        
                    if (password == user.password) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Password Incorrect' })
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