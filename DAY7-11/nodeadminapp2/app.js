var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// ORM 연동 (sequelize ORM 객체를 참조)
// Node.JS 어플리케이션 최초 실행 시 MySQL Server DB와 연결하고 테이블 자동 생성. 
// model 폴더 내 각종 model.js 스크립트들을 활용, 연결된 DB에 물리적으로 테이블 생성 (이미 존재할 경우 생성 X)
var sequelize = require('./models/index.js').sequelize;
var app = express();
sequelize.sync(); // 실제 DB와 연결 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
