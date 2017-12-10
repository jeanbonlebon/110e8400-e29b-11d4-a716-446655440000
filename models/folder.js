const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('./user');


var FolderSchema = new Schema ({
    name: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
    },
    parents: [
       Schema.Types.ObjectId
    ],
    path: {
      type: String,
    },
    },
    {
      timestamps: true
    }
);

module.exports = mongoose.model('Folder', FolderSchema);
