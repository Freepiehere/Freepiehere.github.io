var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var countyRouter = require('./routes/county-api');
var app = express();

var mysql = require('mysql');
const PORT = process.env.PORT || 3001;

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var config = require('./config/config');

const state_connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.state_database
});

const county_connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.county_database
});


state_connection.connect(function(err){
    (err)? console.log(err): console.log(state_connection);
});


require('./routes/county-routes')(app,county_connection);
require('./routes/html-routes')(app,state_connection);
require('./routes/county-api')(app);
//app.listen(PORT, () => {
//    console.log(`App running on port ${PORT}`);
//});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/County_Crime', countyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
