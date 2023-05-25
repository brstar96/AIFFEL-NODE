// 관리자 사이트 계정을 관리하는 스크립트 
var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs') // 단방향 암호화 패키지 
var db = require('../models/index.js');

// localhost:3000/admin/list
router.get('/list', async(req, res)=>{
    res.render('admin/list.ejs')
});

// localhost:3000/admin/list
router.get('/create', async(req, res)=>{
    res.render('admin/create.ejs')
});

// 신규 관리자 계정 등록 API
// localhost:3000/admin/create
router.post('/create', async(req, res)=>{
    // step1: 관리자 계정 정보를 form 태그에서 추출
    var admin_id = req.body.admin_id
    var admin_password = req.body.admin_password
    var admin_name = req.body.admin_name

    // 단방향 암호화 문자열 생성 (bcrypt.hash(암호화할 텍스트, 암호화 적용 횟수))
    const encryptedPassword = await bcrypt.hash(admin_password, 12)

    // step2: 관리자 정보를 관리자 계정 테이블에 저장
    var admin = {
        admin_id, 
        admin_password:encryptedPassword, 
        admin_name, 
        reg_date:Date.now(), 
        reg_member_id:1
    }
    
    // 관리자계정 DB에 등록하기 
    var registedAdmin = await db.Admin.create(admin)

    // step3: 관리자 목록 페이지로 이동
    res.redirect('/admin/list')
});



module.exports = router;