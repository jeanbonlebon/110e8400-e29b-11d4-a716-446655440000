const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      config = require('../config/main'),
      sha3_256 = require('js-sha3').sha3_256,
      mkdirp = require('mkdirp'),
      bcrypt = require('bcrypt-nodejs');

const sshHelper = require('../helpers/sshHelper');

var UserSchema = new Schema ({
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String
    },
    profile: {
      firstName: { type: String },
      lastName: { type: String }
    },
    space_available: {
      type: Number,
      required: true
    },
    facebook: {
      id: String,
      token: String,
    },
    google: {
      id: String,
      token: String,
    },
    },
    {
      timestamps: true
    }
);


UserSchema.pre('save', function(next) {
    const user = this,
          SALT_FACTOR = 5;

    if (!user.isModified('password')) { return next() } //Test if mdp is modified

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
          if (err) return next(err);
          user.password = hash;
          next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return cb(err) }

        cb(null, isMatch)
    });
}

UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({ 'facebook.id': profile.id }, function(err, user) {
        if (!user) {
            var newUser = new that({
                email: profile.emails[0].value,
                profile: {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName
                },
                facebook: {
                    id: profile.id,
                    token: accessToken
                },
                space_available: 32212254720
            })
            newUser.save(function(error, savedUser) {
                if (error)  console.log(error)

                if(env == 'production') {

                    sshHelper('add_folder', sha3_256(savedUser._id.toString()))
                    .then(function() {
                        cb(error, savedUser)
                    })
                    .catch(function(err) {
                        console.log(err)
                    })
    
                } else {

                    mkdirp(config.data_path + '/' + sha3_256(savedUser._id.toString()), function (err) {
                        if (err) console.log(err)

                        return cb(error, savedUser)
                    })

                }

            })
        } else {
            return cb(err, user)
        }
    })
}

UserSchema.statics.upsertGlUser = function(accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({ 'google.id': profile.id }, function(err, user) {
        if (!user) {
            var newUser = new that({
                email: profile.emails[0].value,
                profile: {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName
                },
                google: {
                    id: profile.id,
                    token: accessToken
                },
                space_available: 32212254720
            })
            newUser.save(function(error, savedUser) {
                if (error)  console.log(error)

                mkdirp(config.data_path + '/' + sha3_256(savedUser._id.toString()), function (err) {
                    if (err) console.log(err)

                    return cb(error, savedUser)
                })
            })
        } else {
            return cb(err, user)
        }
    })
}

module.exports = mongoose.model('User', UserSchema);
