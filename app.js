var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');

var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "datastore-9fd58.appspot.com"
});

var login = require('./routes/auth');
var locations = require('./routes/locations');
var addLocation = require('./routes/add_location');
var buildings = require('./routes/buildings');
var addBuilding = require('./routes/add_building');
var rooms = require('./routes/rooms');
var addRoom = require('./routes/add_room');
var addFloorplan = require('./routes/add_floorplan');
var trackLocation = require('./routes/track_location');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'floorplans')));
app.use(fileUpload());
app.use(require('express-session')({
  secret: 'aaasp18',
  resave: false,
  saveUninitialized: false
}));

app.use('/', login);
app.use('/locations', locations);
app.use('/addlocation', addLocation);
app.use('/buildings', buildings);
app.use('/addbuilding', addBuilding);
app.use('/rooms', rooms);
app.use('/addroom', addRoom);
app.use('/addfloorplan', addFloorplan);
app.use('/tracklocation', trackLocation);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
