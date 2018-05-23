const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      config = require('./config/main'),
      cors = require('cors'),
      multer  = require('multer'),
      upload = multer(),
      passport = require('passport');

const UserRoute = require('./routes/userRoute.js'),
      AuthRoute = require('./routes/authRoute.js'),
      FolderRoute = require('./routes/folderRoute.js'),
      FileRoute = require('./routes/fileRoute.js');

const sshHelper = require('./helpers/sshHelper'),
      env = process.env.NODE_ENV;

mongoose.Promise = global.Promise;
env == 'production' ? mongoose.connect(config.database_prod) : mongoose.connect(config.database_local);

var app = express();

app.use(cors());
app.use('/files', express.static(config.data_path));
app.use('/doc', express.static('doc'));

app.use(multer({ dest: './tmp/',
      rename: function (fieldname, filename) {
            return filename;
      },
}).any());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/folder', FolderRoute);
app.use('/file', FileRoute);

env == 'production' ? console.log(env, 'prod') : console.log(env, 'dev or sandbox')

app.listen(3000);
