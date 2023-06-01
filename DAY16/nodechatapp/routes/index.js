var express = require('express');
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
  res.render('login');
});

// 회원가입 페이지 (localhost:3000/signup)
router.get('/signup', function(req, res, next) {
  res.render('signup');
});



module.exports = router;
