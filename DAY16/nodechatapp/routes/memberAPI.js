var express = require('express');
var router = express.Router();

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

//db객체 참조 
var db = require('../models/index');
const e = require('express');


//신규회원 가입 처리 REST API 라우팅 메소드
//localhost:3000/api/member/signup
router.post('/signup', async(req, res, next)=> {
    
    //api 프론트로 반환하는 결과값 형식 정의 
    var result = {
        code:200,
        msg:"",
        data:null
    };


    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var telephone = req.body.telephone;

    try{

        //step1:사용자 암호를 해시알고리즘 단방향 암호화 적용
        var encrytPassword = await bcrypt.hash(password,12);

        //step2:등록할 사용자 데이터 정의 
        var member = {
            email,
            password:encrytPassword,
            name,
            telephone
        };

        var registedMember = await db.Member.create(member);

        result.code = 200;
        result.msg ="Ok";
        result.data = registedMember;

    }catch(Error){
        //서버파일시스템에 로깅파일로 저장합니다.
        result.code = 500;
        result.msg = "서버에러 발생 관리자에게 문의하세요.";
    }

    res.json(result);
});


//회원 로그인 REST API 라우팅 메소드
//localhost:3000/api/member/login
router.post('/login',async(req,res)=>{

    //api 프론트로 반환하는 결과값 형식 정의 
    var result = {
        code:200,
        msg:"",
        data:null
    };

    try{

        //STEP1: 사용자 메일주소와 암호를 추출한다.
        var email = req.body.email;
        var password = req.body.password;

        //STEP2: 사용자 메일주소가 존재하는지 체크한다.
        var member = await db.Member.findOne({where:{email:email}});

        //메일주소가 존재하지 않은 경우 
        if(member == null){
            result.code = 400;
            result.msg = "메일주소가 존재하지 않습니다.";
            return res.json(result); 
        }

        //STEP3: 사용자 메일주소가 존재하는 경우 암호가 동일한지 체크한다.
        var isCorrect = await bcrypt.compare(password,member.password);

        //암호가 다른경우
        if(isCorrect == false){
            result.code = 400;
            result.msg = "암호가 일치하지 않습니다.";
            return res.json(result); 
        }

        //STE4: 메일주소와 암호가 동일한경우 JWT토큰에 담을 사용자 주요 JSON데이터를 만든다.
        var tokenData = {
            member_id:member.member_id,
            email:member.email,
            name:member.name,
            telephone:member.telephone
        };

        //STEP5: 사용자 JSON데이터를 JWT토큰문자열로 만든다.
        var jwtToken = await jwt.sign(tokenData,process.env.JWT_KEY,{
            expiresIn:'60m',
            issuer:'msoftware'
          });

        //STEP6: 프론트엔드 전달 데이터값으로 JWT토큰문자열을 전달한다.
        result.code = 200;
        result.msg = "Ok";
        result.data = jwtToken

    }catch(Error){
        result.code = 500;
        result.msg = "서버에러 발생 관리자에게 문의하세요.";
    }

    res.json(result);

});

// 이미 로그인한 사용자의 기본 프로필 정보 조회 API (localhost:3000/member/profile)
// 로그인 시 서버에서 발급된 JWT 토큰에서 사용자 메일 주소 추출 및 해당 사용자 정보 조회 & 리턴 
// 토큰이 있으면 토큰에서 사용자 정보를 추출하고, 토큰이 없으면 로그인 페이지로 이동
router.get('/profile',async(req,res)=>{
    
    var result = { //api 프론트로 반환하는 결과값 형식 정의 
        code:200,
        msg:"",
        data:null
    };

    try{
        // STEP1. JWT 토큰이 있는지 확인 (HTTP의 헤더의 authorization 영역 확인)
        const token = req.headers.authorization.split('Bearer ')[1];
        console.log("프론트제공 jwt토큰", token);

        if (token == undefined){ // 토큰이 없는 경우 
            result.code = '404';
            result.data = []
            result.msg = 'Token not exist.'

            return res.json(result)
        }else{
            // STEP2. JWT 토큰에서 메일 주소 추출
            var currentMember = jwt.verify(token, process.env.JWT_SECRET);
            console.log("토큰에서 추출한 사용자 정보", currentMember);

            // 현재 사용자의 이메일 주소 추출
            var loginMemberEmail = currentMember.email

            // STEP3. 메일 주소를 통해 사용자 정보 조회
            var memberData = await db.Member.findOne({where:{email:loginMemberEmail}});
            result.code = 200;
            result.data = memberData
            result.msg = 'Ok.'

            return res.json(result)
        }
    }catch(Error){
        result.code = 500;
        result.msg = "서버에러 발생 관리자에게 문의하세요.";
    }

    // STEP4. 조회결과 데이터 반환 
    res.json(result)
});

module.exports = router;