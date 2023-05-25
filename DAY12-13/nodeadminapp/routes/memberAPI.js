// 회원정보 관리 RESTful API 라우터 파일 (localhost:3000/api/members/~)
// 데이터 처리 요청/응답 처리 

var express = require('express');
var router = express.Router();

// ORM DB객체(model) 참조하기 
var db = require('../models/index.js')

// 모든 회원목록 조회 요청 및 반환 라우팅 메소드 (localhost:3000/api/members/)
router.get('/', async(req, res)=>{
    
    // Member model을 통해 members DB table의 모든 사용자 목록 조회
    // sequelize ORM의 모델명.findAll은 매핑된 물리 테이블의 모든 데이터 조회
    // findAll() 메소드는 SELECT * FROM members; SQL 문장을 MySQL 서버에 전달 후 리턴받음
    var members = await db.Member.findAll();
    res.json(members);
})

// 신규회원 정보 등록  (localhost:3000/api/members/create)
router.post('/create', async(req, res)=>{
    // Step 1. 클라이언트에서 전달되는 신규회원정보 추출
    var email = req.body.email;

    // Step 2. member Table에 저장할 데이터 객체 생성 (반드시 해당 모델의 구조를 따라야 함 - models/member.js)
    var member = {
        email:email
    }

    // Step 3. db.Member.create() 메소드 활용해 members 테이블에 데이터 등록 
    // INSERT INTO 테이블명(컬럼명1, 컬럼명2, ...) VALUES(값1, 값2, ...)
    // INSERT 쿼리는 반드시 Table에 저장한 데이터를 반환해주는 특성이 있음 -> 등록된 실제 데이터 반환 
    var registedMember = await db.Member.create(member); // SQL의 INSERT INTO와 동일 
    
    // Step 4. 실제 DB Table에 저장된 값 클라이언트에 반환 (선택)
    res.json(registedMember)
})

// 기존회원 정보 수정 (localhost:3000/api/members/update)
router.post('/update', async(req, res)=>{
    // Step 1. 클라이언트에서 전달된 회원정보 추출
    var memberId = req.body.memberId
    var email = req.body.email

    // Step 2. model 구조 기반으로 수정할 내용 정의
    var member = {
        // member_id:memberId, 
        email:email
    }
    
    // Step 3. Members model의 update() 메소드 이용, 데이터 수정(조건 걸기)
    // update() 메소드는 `모델.update(수정할 데이터, {조건절{조건을 걸 항목:조건의 값}})`를 통해 조건에 맞는 데이터 수정 
    // `UPDATE members SET email='수정할메일주소' WHERE member_id=1`과 같은 역할 (실행 후 몇 건이 수정되었는지 건수가 반환됨)
    var updatedCnt = await db.Member.update(member, {
        where: {
            member_id:memberId
        }
    });

    // 리턴 형태 정해주기  
    var result = {
        code:200, // 상태코드
        message:"정상적으로 수정됨", 
        date:updatedCnt
    }
    res.json(result)

})

// 기존 단일 회원 정보 삭제 (localhost:3000/api/members/delete)
router.post('/delete', async(req, res)=>{
    // 삭제할 유저 조회
    var memberId = req.body.memberId
    var deletedCnt = await db.Member.destroy({
        where:{
            member_id:memberId
        }
    })

    // 상태 반환
    res.json({result:deletedCnt})
})

// 특정 회원 정보 조회(Querystring 활용, localhost:3000/api/members/detail?mid=1)
router.get('/detail', async(req, res)=>{
    var memberId = req.query.mid; // query string 받기 
    
    // SELECT * FROM members WHERE member_id=1;
    var member = await db.Member.findOne({
        where:{
            member_id:memberId
        }
    });

    res.json(member);
})

// 특정 회원 정보 조회(Parameter 활용, localhost:3000/api/members/1)
router.get('/:mid', async(req, res)=>{
    var memberId = req.params.mid;
    var member = await db.Member.findOne({
        where:{
            member_id:memberId
        }
    })
    res.json(member)
})

module.exports = router;