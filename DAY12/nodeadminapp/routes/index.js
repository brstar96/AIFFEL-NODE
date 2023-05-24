var express = require('express');
var router = express.Router();

// DB ORM 객체 참조하기 
var db = require('../models/index.js')
var bcrypt = require('bcryptjs')

// main page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// 관리자 사이트 login router (localhost:3000/login)
router.get('/login', async(req, res, next)=>{
  // res.render('login.ejs', {layout: 'loginLayout.ejs'}); // 로그인 전용 레이아웃 사용 
  res.render('login.ejs')
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
    res.render('login.ejs')
  }else{ // 관리자 존재하는 경우 메인 페이지로 이동 
    // step3. 동일한 아이디가 존재할 경우 단방향 암호화된 암호와 동일한지 체크 
    // bcrypt.compare(폼에서 넘어온 사용자 암호, DB에 저장된 단방향 암호화 문자열) => boolean
    var isCorrectPwd = await bcrypt.compare(admin_password, admin.admin_password)

    if(isCorrectPwd == true){
      // step4. 정상적으로 로그인된 경우 메인 페이지로 이동 
      res.redirect('/');
    }else{ // 사용자 암호 일치하지 않는 경우 
      res.render('/login.ejs')
    }  
  }
});

module.exports = router;
