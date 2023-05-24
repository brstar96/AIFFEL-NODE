var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article') // 기본 라우터 정의
var memberAPIRouter = require('./routes/memberAPI') // 기본 라우터 정의
var adminRouter = require('./routes/admin') // 기본 라우터 정의

var sequelize = require('./models/index.js').sequelize;

// dotenv 환경설정 패키지 참조 + 환경구성정보 불러옴 (프로젝트 루트의 .env파일에서 로드)
require('dotenv').config()

var app = express();
sequelize.sync();

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
app.use('/article', articleRouter); // 게시글 관리 주소
app.use('/api/members', memberAPIRouter); // 회원정보 관리 주소
app.use('/admin', adminRouter) // 관리자 정보 관리 주소

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
