var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require("cors");

require('dotenv').config()

var sequelize = require('./models/index.js').sequelize;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memberAPIRouter = require('./routes/memberAPI');

var app = express();

//mysql과 자동연결처리 및 모델기반 물리 테이블 생성처리제공
sequelize.sync(); 

// 모든 CORS 요청 오픈 
app.use(cors())

//특정 도메인주소만 허가
// app.use(
//   cors({
//   methods: ["GET", "POST", "DELETE", "OPTIONS"],
//   origin: ["http://localhost:3030", "https://beginmate.com"],
//   })
// );

//socket.js socket.io CORS 통신설정 예시 – socket cors 이슈 발생시 사용
// const io = SocketIO(server, {
//   path: "/socket.io",
//   cors: {
//   origin: "*",
//   methods: ["GET", "POST"],
//   },
// });

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
app.use('/api/member', memberAPIRouter);

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
