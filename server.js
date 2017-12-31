const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      config = require('./config/main'),
      multer  = require('multer'),
      upload = multer(),
      passport = require('passport');

const UserRoute = require('./routes/userRoute.js'),
      AuthRoute = require('./routes/authRoute.js'),
      FolderRoute = require('./routes/folderRoute.js'),
      FileRoute = require('./routes/fileRoute.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(multer({ dest: './tmp/',
   rename: function (fieldname, filename) {
     return filename;
   },
}).any());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute);
app.use('/api/folder', FolderRoute);
app.use('/api/file', FileRoute);

app.listen(3000);
