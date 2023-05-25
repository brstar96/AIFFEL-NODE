var express = require('express');
var router = express.Router();

// DB ORM 객체 참조하기 
var db = require('../models/index.js')
var bcrypt = require('bcryptjs')

// 세션 권한 미들웨어 참조하기 (비구조화할당) - function 콜백함수 실행 전 먼저 실행됨. 
var {isLoggedIn} = require('./authorizeMiddleware.js')

// main page (localhost:3000/)
router.get('/', isLoggedIn, function(req, res, next) {
  // 아래와 같은 방법으로 권한 체크시 모든 라우터에서 조건문을 반복사용해야 하는 문제 존재 
  // if(req.session.isLogined == undefined){
  //   res.render('/login')
  // }else{
  //   res.render('index', { title: 'Express' });
  // }

  res.render('index', { title: 'Express' });
});


// 관리자 사이트 login router (localhost:3000/login)
router.get('/login', async(req, res, next)=>{
  // res.render('login.ejs', {layout: 'loginLayout.ejs'}); // 로그인 전용 레이아웃 사용 
  res.render('login.ejs', {loginResult:""})
});

// 관리자 로그인 정보 처리:관리자 계정과 암호를 비교, 로그인 기능 구현 (localhost:3000/login)
router.post('/login', async(req, res, next)=>{
  // step1. login form에서 사용자 아이디, 암호 추출
  var admin_id = req.body.admin_id
  var admin_password = req.body.admin_password

  // step2. 동일한 사용자 아이디가 존재하는지 DB에서 확인 (row가 넘어옴!!)
  var admin = await db.Admin.findOne({where:{
    admin_id:admin_id // 속성명:form에서 넘겨받은 값
  }})

  if(admin == null){ // 동일한 아이디의 관리자 존재하지 않는 경우 
    res.render('login.ejs', {loginResult:"아이디가 일치하지 않습니다."})
  }else{ // 관리자 존재하는 경우 메인 페이지로 이동 
    // step3. 동일한 아이디가 존재할 경우 단방향 암호화된 암호와 동일한지 체크 
    // bcrypt.compare(폼에서 넘어온 사용자 암호, DB에 저장된 단방향 암호화 문자열) => boolean
    var isCorrectPwd = await bcrypt.compare(admin_password, admin.admin_password)

    if(isCorrectPwd == true){
      /*
      step4. 서버 세션 정의 및 저장하기
        로그인한 사용자 정보 중 중요 정보를 서버 세션으로 저장하고, 세션 아이디 값을 쿠키에 담아 브라우저에 전달
        브라우저는 인증(로그인) 시 아까 발급한 쿠키를 통해 재로그인 없이 서버에서 사용자 인식하게 됨. 
        브라우저는 서버에 서비스 요청 시마다 발급된 쿠키를 서버에 전달하고, 서버는 쿠키 안에 있는 세션 아이디 값을 기준으로 
        서버 메모리에 저장된 세션 목록에서 사용자정보를 추출, 사용자를 인식한다. 

        * 세션: 사용자 단위로 정보를 관리하는 단위 (req.session: 현재 접속한 사용자에 대한 정보)
      */
     
      //req.session객체에 다양한 동적 속성 추가
      req.session.isLogined = true; // 로그인 여부 불린값
      
      // loginUser라는 동적속성을 세션 객체에 정의 후 현재 로그인한 사용자의 다양한 정보를 각각의 속성으로 저장 
      req.session.loginUser ={
        userSeq:admin.admin_member_id, // 사용자고유번호를 admin model에서 가져옴 
        userId:admin.admin_id,
        userName:admin.admin_name
      };

      // 세션에 추가한 동적 속성과 값을 최종 저장 - req.session.save() 메소드가 호출되면 동적 속성값을 세션 객체에 저장
      // 세션 아이디 값을 기준으로 서버에서 쿠키를 웹브라우저에 발급해 저장시킴. 
      req.session.save(function(){
        // step5. 정상적으로 로그인된 경우 메인 페이지로 이동
        res.redirect('/');
      })

      
    }else{ // 사용자 암호 일치하지 않는 경우 
      res.render('login.ejs', {loginResult:"암호가 일치하지 않습니다."})
    }  
  }
});

// 로그인한 사용자의 프로필 소개 페이지 
// localhost:3000/profile
router.get('/profile', isLoggedIn, async(req, res)=>{
  // undefined일 경우는 로그인을 하지 않은 경우일 것! - isLoggedIn 미들웨어를 사용하면 일일히 조건비교 X
  // if(req.session.isLogined == undefined){
  //   res.redirect('/login') // 로그인 페이지로 이동 
  // }else{
  //   // 현재 로그인 사용자 세션 정보 추출하기 
  //   var userSession = req.session.loginUser
    
  //   // 유저 프로필 웹페이지 보여주기
  //   res.render('profile.ejs', {userData:userSession})
  // }

  var userSession = req.session.loginUser
    
  // 유저 프로필 웹페이지 보여주기
  res.render('profile.ejs', {userData:userSession})
})

// logout 처리 (이후 logout 버튼에서 /logout 호출하면 세션 삭제)
router.get('/logout', async(req, res)=>{
  req.session.destroy(function(err){
    res.redirect('/login')
  })
})

module.exports = router;
