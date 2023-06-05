var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 채팅 메인페이지 (localhost:3000/chat)
router.get('/chat', function(req, res, next) {
  res.render('chat.ejs');
});

// 로그인 페이지 (localhost:3000/login)
router.get('/login', function(req, res, next) {
  res.render('login.ejs');
});

// 회원가입 페이지 (localhost:3000/signup)
router.get('/signup', function(req, res, next) {
  res.render('signup.ejs');
});

// JWT 토큰 데이터 형식 웹페이지  (localhost:3000/token)
router.get('/token', function(req, res, next) {
  res.render('token');
});

// JWT 토큰 생성 라우팅 메소드 (localhost:3000/token)
router.post('/token', function(req, res, next) {
  var email = req.body.email;
  var name = req.body.name;
  var telephone = req.body.telephone;
  var usertype = req.body.usertype;

  // STEP1. JWT 토큰에 담을 JSON 데이터 정의 (로그인 사용자 정보라고 가정!)
  var userData = {
    email, 
    name,
    telephone,
    usertype
  }

  // STEP2. userData JSON 데이터를 JWT 토큰으로 변환(scret key는 자유롭게 생성)
  // jwt.sign('토크나이즈할 JSON data', 'secret key', 'options')
  var token = jwt.sign(userData, process.env.JWT_KEY, {
    expiresIn: '1h', // 유효시간 24시간 (1시간은 1h, 1분은 1m, 1초는 1s)
    issuer: 'MYEONGGYULEE', // 발급자
  })
  
  // STEP3. 생성된 JWT 토큰을 클라이언트에게 전달 (여기서는 무지성으로 JSON 출력)
  res.json({token: token});
});

// JWT 토큰 문자열 복호화 라우팅 메소드 (localhost:3000/verify?token=eyJhbGc...)
router.get('/verify', function(req, res, next) {
  // STEP1. 전달된 토큰 문자열 추출
  var jwtToken = req.query.token;

  // STEP2. 추출된 토큰 문자열을 복호화하여 JSON 객체로 변환 (토큰 복호화는 가급적 try-catch문으로 예외처리)
  var result = {
    msg: "",
    data: null
  }
  
  // JWT 토큰이 정상일 경우 - 만료일시가 지나지 않았고, secret key가 일치하는 경우 등등 
  // jwt.verify('추출된 JWT 토큰 문자열', 'secret key')
  try{ 
    var jsonData = jwt.verify(jwtToken, process.env.JWT_KEY);
    result.msg = "정상적으로 복호화 되었습니다.";
    result.data = jsonData;
  }catch(Error){
    result.msg = "유효하지 않은 토큰입니다.";
  }

  res.json(result);
});


module.exports = router;
