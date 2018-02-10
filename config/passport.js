const passport = require('passport'),
      User = require('../models/user'),
      sha3_256 = require('js-sha3').sha3_256,
      mkdirp = require('mkdirp'),
      config = require('./main'),
      GoogleTokenStrategy = require('passport-google-token').Strategy,
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

const googleOptions = {
    clientID        : config.glConfig.appID,
    clientSecret    : config.glConfig.appSecret
}
const googleLogin = new GoogleTokenStrategy(googleOptions, function(accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken, profile)
    User.upsertGlUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
    })
})

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

passport.use(googleLogin);
passport.use(facebookLogin);
passport.use(jwtLogin);
passport.use(localLogin);
