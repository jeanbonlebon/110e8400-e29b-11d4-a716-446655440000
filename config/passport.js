const passport = require('passport'),
      User = require('../models/user'),
      sha3_256 = require('js-sha3').sha3_256,
      mkdirp = require('mkdirp'),
      config = require('./main'),
      FacebookTokenStrategy = require('passport-facebook-token'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' }

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
        if(err) return done(err)
        if(!user) return done(null, false, { error: 'Your login details could not be verified. Please try again.' })

        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err)
            if (!isMatch) return done(null, false, { error: "Your login details could not be verified. Please try again." })

            return done(null, user)
        })
    })
})

const facebookOptions = {
    clientID        : config.fbConfig.appID,
    clientSecret    : config.fbConfig.appSecret
}
const facebookLogin = new FacebookTokenStrategy(facebookOptions, function(accessToken, refreshToken, profile, done) {
    User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
    })
})
/*
const facebookOptions = {
    clientID        : config.fbConfig.appID,
    clientSecret    : config.fbConfig.appSecret,
    callbackURL     : config.fbConfig.callbackUrl,
    profileFields   : ['id', 'email', 'first_name', 'last_name'],
}

const facebookLogin = new FacebookStrategy(facebookOptions, function(access_token, refresh_token, profile, done) {
    process.nextTick(function() {

        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
            if (err) return done(err)
            if (user) return done(null, user)

            let newUser = new User()
            newUser.facebook.id = profile.id;
            newUser.facebook.access_token = access_token;
            newUser.profile.firstName  = profile.name.givenName;
            newUser.profile.lastName = profile.name.familyName;
            newUser.email = profile.emails[0].value;

            newUser.save(function(err) {
                if (err) throw err

                mkdirp('../folders/' + sha3_256(newUser._id.toString()), function (err) {
                    if (err) throw err

                    return done(null, newUser)
                })
            })
        })
    })
})
*/
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: config.secret
}

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    User.findById(payload._id, function(err, user) {
        if (err) return done(err, false)

        user ? done(null, user) : done(null, false)
    })
})

//passport.use(facebookLogin);
passport.use(facebookLogin);
passport.use(jwtLogin);
passport.use(localLogin);
