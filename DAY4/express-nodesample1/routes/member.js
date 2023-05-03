// app.js에서 member.js 라우터 파일의 기초 호출 주소 체계는 localhost:3000/member/~ 로 설정해야 아래 체계가 작동!

var express = require('express')
var router = express.Router()

// 라우팅에 대한 구체적인 기능 구현 (회원 신규 가입 웹페이지 요청, 응답 처리 라우팅 메소드)
// http://localhost:3000/member/entry
router.get('/entry', function(req, res){
    res.render('entry.ejs')
});

// 회원 로그인 웹페이지 요청 및 응답 처리 라우팅 메소드 정의 
// http://localhost:3000/member/login
router.get('/login', function(req, res){
    res.render('login.ejs')
});

// 회원 프로필 정보 조회 페이지 
// http://localhost:3000/member/profile
router.get('/profile', function(req, res){
    res.render('profile.ejs')
});

module.exports = router;