const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('./user'),
      Folder = require('./folder');


var FileSchema = new Schema ({
    name: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    folder: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
    },
    type: {
      type: String
    },
    size: {
      type: Number,
      required: true
    },
    },
    {
      timestamps: true
    }
);

module.exports = mongoose.model('File', FileSchema);
