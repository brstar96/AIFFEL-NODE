var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// express-session 패키지 참조
var session = require('express-session');


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

// 서버 세션 구현 
app.use(
  session({ // 
    resave: false, 
    saveUninitialized: true, // 사용자가 로그인 후 서버 리소스를 요청할 때마다 세션 타임아웃 자동 증가. 
    secret: "testsecret", // 보안 키값
    cookie: {
      httpOnly: true, // 발급된 쿠키가 HTTP 환경에서도 사용되도록 설정
      secure: false, // 보안 쿠키 생성 옵션 (쿠키 안의 값을 난독화)
      maxAge:1000 * 60 * 30 //5분동안 서버세션을 유지하겠다.(1000은 1초)
    },
  }),
);


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
