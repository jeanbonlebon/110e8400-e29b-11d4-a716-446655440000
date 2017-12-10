const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema ({
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profile: {
      firstName: { type: String },
      lastName: { type: String }
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
        if (err) { return cb(err); }

        cb(null, isMatch);
    });
}

module.exports = mongoose.model('User', UserSchema);
