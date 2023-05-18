// member.js 라우터 파일은 각종 회원정보 관리용 웹페이지에 대한 사용자 요청, 응답 처리 담당
// member.js 라우터 파일의 기본 경로는 localhost:3000/members/
// member.hs 라우터 스크립트 내에 정의된 메소드의 기본 주소 경로는 localhost:3000/members/~

var express = require('express');
var db = require('../models/index')
var Op = db.Sequelize.Op;
var router = express.Router();

router.post('/entry', async(req, res)=>{
    var email = req.body.email;
    var member_password = req.body.password;
    var name = req.body.name;
    var telephone = req.body.telephone;

    var member = {
        email:email
    };

    // 회원 정보 DB에 신규 CREATE
    await db.Member.create(member)
    res.redirect('/member/list')

})

// get 방식으로 브라우저에서 메소드 호출 시 아래의 콜백 함수가 실행됨
// 클라이언트에서 get으로 요청이 오면 라우팅 메소드도 get()으로 받고, 
// post 방식으로 클라이언트가 주소를 요청해 오면 라우팅 메소드도 post()로 받아줘야 함. 
// 클라이언트가 최초로 웹 브라우저 주소창에 url 주소를 직접 입력해 요청하는 경우는 다 get()임. 

// 회원가입 웹페이지 요청과 응답 처리 메소드 
// localhost:3000/members/regist
router.get('/regist', function(req, res){ // request, response 객체
    res.render('member/regist.ejs');
})

// 회원가입페이지(./views/member/regist.ejs)에서 넘겨받은 데이터를 처리하는 라우터 메소드
// 라우팅 메소드는 반드시 호출 주소 체계와 호출 메소드의 조합으로 중복 정의하면 안됨! 
// -> router.post에 같은 주소 쓰지 말라는 이야기. 또는 메소드를 다르게 하라는 뜻. (get, post, put 등)
router.post('/regist', function(req, res){ // request, response 객체
  // 사용자가 회원가입 form에서 입력한 데이터를 추출해 DB에 저정하고 저장을 완료하면 특정 웹페이지로 이동하도록 구현 

  // form 태그에 post 방식으로 넘어오는 form 데이터는 req 객체의 body 속성으로 참조 가능
  // req는 httpRequest 객체를 활용, 브라우저에서 넘어오는 모든 정보를 서버에서 추출 가능함. 
  // req.body.email = <input type='text' name='email' .>에서 'email'로 참조하는 것을 확인 가능 
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;

  // 추후 model을 통해 DB에 저장하는 코드를 추가! (이 예제에서는 DB에 저장했다고 일단 가정하고 진행)

  // 회원가입이 마무리된 후 메인 페이지로 이동시키기: res.redirect('url') 활용
  // res.redirect의 경로로 view 파일 주소를 입력하면 작동 안됨!!!
  res.redirect('/');
//   res.redirect('https://www.naver.com');

})

// 가입회원 목록 페이지 요청 및 응답 처리 메소드
router.get('/list', function(req, res){
    res.render('member/list.ejs') // view 전달
  })
  

// Login 요청, 응답 처리 메소드 
// localhost:3000/members/login
router.get('/login', function(req, res){
    res.render('member/login.ejs')
})

// 사용자 프로필 웹페이지 요청, 응답 처리 라우팅 메소드 정의
// http://localhost:3000/member/profile?uid=1
router.get('/profile', function(req, res){
    // req.query라는 속성을 통해 url 내 쿼리스트링으로 전달되는 키 값 추출
    var userId = req.query.uid;
    var test = req.query.test;

    // res.render('뷰파일 경로', 뷰파일에 전달할 JSON 데이터 객체)와 같이 데이터도 전달할 수 있음. 
    // 세 개의 속성을 가지고 있는 하나의 JSON 객체 전달
    res.render('member/profile.ejs', {uid:userId, userName:'이명규', email:'test@test.co.kr'})

})

// 로그인 후 보여줄 사용자 프로필 웹페이지 요청, 응답 처리 라우팅 메소드
// localhost:3000/members/profile/1
// 파라미터 방식으로 url을 통해 데이터가 전달되는 경우 와일드카드를 정의해 데이터를 추출. 
// 와일드카드란?: `주소/:keyname`처럼 매개변수를 지정하는 방식
router.get('/profile/:uid', function(req, res){
    // 와일드카드에 정의된 키 값으로 url에 전달된 1이라는 값 추출 
    // 파라미터 방식으로 값이 전달되면 아래와 같이 req.params라는 속성의 와일드카드 키 이름으로 값 추출 가능. 
    var uid = req.params.uid;
    var userName = "이명규22"
    var email = 'test22@test.co.kr'
    res.render('member/profile.ejs', {uid, userName, email}) // 속성명과 변수명이 같아 키 정의 생략 

})

// 단일 회원정보 데이터 요청과 응답을 처리하는 REST API 라우팅 메소드 정의 (데이터만 제공하는 목적의 라우터!!!!)
// localhost:3000/member/data/profile?uid=1
router.get('/data/profile', function(req, res){
    var uid = req.query.uid // 쿼리스트링으로 넘어온 값 받기
    
    // DB에서 uid 기준으로 조회해온 단일 사용자 JSON이라고 가정:
    var userData = {
        uid:uid,
        userName:"이명규33", 
        email:'test3@test.co.kr'
    }

    // DB에서 가져온 userData를 클라이언트에게 응답으로 제공 
    res.json(userData);

})

// 모든 회원 목록 데이터 요청과 응답을 처리하는 REST API 라우팅 메소드 정의
// localhost:3000/member/data/users/all로 호출해야 함. 
router.get('/data/users/all', function(req, res){
    
    // DB에서 ORM을 통해 전체 회원 데이터를 가져왔다고 가정: 
    var userList = [
        {
            uid:1,
            userName:"이명규44", 
            email:'test4@test.co.kr'
        },
        {
            uid:2,
            userName:"이명규55", 
            email:'test5@test.co.kr'
        },
        {
            uid:3,
            userName:"이명규66", 
            email:'test6@test.co.kr'
        }
    ];

    res.json(userList);
})

module.exports = router; // 외부에 반드시 노출해 주기 