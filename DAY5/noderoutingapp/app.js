var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// 개발자 정의 라우터 파일을 참조 
var memberRouter = require('./routes/member.js');
var articleRouter = require('./routes/article.js');

// 데이터만 처리하는 REST API 라우터
var articleAPIRouter = require('./routes/article_api.js');

var app = express(); 

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

// 각종 라우터 파일의 주소 체계 정의하기
app.use('/member', memberRouter);

// 게시글 데이터 처리를 위한 REST API ejs 스크립트의 기본 주소 
app.use('/api/articles', articleAPIRouter);

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
