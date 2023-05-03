// 노드 어플리케이션에 대한 설정을 관장하는 스크립트 

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 라우터 폴더 내에 있는 각종 라우터 파일을 참조
// 모든 라우터 파일은 생성 후 이 부분에서 참조하도록 설정해 주어야 함. 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// 개발자가 정의한 라우터 파일을 참조하도록 설정하기 (회원 정보 요청/응답 처리를 위한 라우터)
var memberRouter = require('./routes/member.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 상단에서 참조한 라우터 파일의 기초 호출 주소 체계 정의 (e.g. http://localhost:3000/(루트)/contact)
// index.js 라우터 파일의 기본 주소체계는 localhost:3000/로 설정됨
app.use('/', indexRouter); // '/mgl로 설정하는 경우 http://localhost:3000/mgl/'로 시작하게 됨. 

// user.js 라우터 파일은 기본주소체계가 localhost:3000/users가 기본주소를 가지게 됨.
app.use('/users', usersRouter);

// member.js 라우터 파일의 기본 주소 체계를 localhost:3000/memver/~ 로 설정 
app.use('/member', memberRouter);

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
