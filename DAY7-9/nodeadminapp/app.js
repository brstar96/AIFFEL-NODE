var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 레이아웃 패키지 참조하기 
var expressLayouts = require('express-ejs-layouts'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article') // 기본 라우터 정의

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 레이아웃에 대한 설정 
app.set('layout', 'layout'); // 모든 ejs 파일의 기본 레이아웃 ejs 파일명 지정 
app.set("layout extractScripts", true); // 오리지널 콘텐츠 ejs 파일 내(list.ejs)의 script 태그를 레이아웃 페이지에 적용할지 여부 
app.set("layout extractStyles", true); // 오리지널 콘텐츠 ejs 파일 내(list.ejs)의 style 태그를 레이아웃 페이지에 적용할지 여부 
app.set("layout extractMetas", true);// 오리지널 콘텐츠 ejs 파일 내(list.ejs)의 meta 태그를 레이아웃 페이지에 적용할지 여부 
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 어플리케이션 미들웨어 샘플 1 (어플리케이션 전역에서 요청 들어올 때마다 실행되는 기능.)
app.use(function(req, res, next) {
  console.log('어플리케이션 미들웨어 호출:', Date.now());
  next(); // 미들웨어 기능 처리 후 원래 요청했던 부분으로 돌아가라는 키워드
});

//어플리케이션 미들웨어 샘플 2
app.use('/user/:id', function (req, res, next) {
const uid = req.params.id;
console.log('어플리케이션 미들웨어 호출2 요청유형:', req.method);
res.send("사용자정보:"+uid); // text, HTML tag, json 등등 다양한 객체를 전달해줄 수 있음. 
// 단, 로직의 복잡도가 올라가므로 가급적 send 사용 지양
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/article', articleRouter); // 기본 주소 정의

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
