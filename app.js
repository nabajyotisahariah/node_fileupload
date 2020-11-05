var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

////////////////////////
const dbConfig = require('./app/config/database.config');
/*const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
/*mongoose.connect( "mongodb://localhost:27017", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
     console.log("Successfully connected to the database");    
}).catch(err => {
     console.log('Could not connect to the database. Exiting now...', err);
     process.exit();
});*/
////////////////////////////

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var searchRouter = require('./routes/search');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// enable files upload
app.use(fileUpload({
    //createParentPath: true,
    useTempFiles : true,
    tempFileDir : '/tmp/',
    limits: { fileSize: 2 * 1024 * 1024 }, //1MB
  }
));

//add other middleware
app.use(cors());
app.use(bodyParser.json()); //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //next(createError(404));
  res.send('404 file');
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
