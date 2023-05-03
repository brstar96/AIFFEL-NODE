// index.js Router 파일은 기본적으로 메인 페이지, 사이트 공통 기능에 대한 사용자 요청과 응답을 처리 
// 라우터 파일의 사용자 요청과 응답 기능 설계는 BE engineer가 담당. 
// 예컨대 상품에 대한 웹페이지/데이터에 대한 요청, 응답의 경우 product.js 파일을 만든 후 회원 정보에 대한 요청/응답은 member.js 라우터 파일을 만드는 식. 
// 사용자는 URL(웹 주소 체계)를 통해 서버에 요청을 하고, BE engineer는 주소 체계에 대한 설계, 구현을 담당. 

// * 모든 라우터 스크립트 파일은 기초 주소 체계를 가짐. 
// * 이 index.js 라우터 파일은 http://localhost:3000/ 주소를 기본 주소로 사용함!! (app.js에서 그렇게 설정해 두었기 때문)
// * 모든 라우터 파일의 기초 주소체계 정의는 app.js 내에서 설정함. 

// express 웹 프레임워크를 참조. 
var express = require('express');

// express 객체의 router 메소드를 호출해 사용자 요청과 응답을 처리할 수 있도록 로드 
var router = express.Router();

/* GET home page. */
// 실질적으로 해당 라우터 파일 내에 라우트 메소드를 통해 개별 사용자 요청/응답 기능을 구현하는 부분 

// 도메인 주소(http://localhost:3000)로 접속 시 브라우저에 전달하는 역할 
// 도메인 주소를 브라우저에 넣으면 router.get 콜백 함수가 실행됨. 
// "index.ejs를 render해라" -> ./views/index.ejs를 실행 -> ejs 문법으로 짜여진 뷰 엔진 스크립트 실행
router.get('/', function(req, res, next) { //
  var test = req.query.uid;
  
  console.log('메인 페이지 라우팅 메소드가 호출되었습니다.')
  console.log('views 폴더 내의 index.ejs 파일 내용이 브라우저로 전달됩니다. ')
  res.render('index.ejs', { title: '안녕하세요111222333' }); // view
});
// 웹사이트 공통기능 중 '문의하기' 페이지에 대한 요청과 응답을 처리하는 라우팅 메소드
// http://localhost:3000/contact 구현해보자. 
router.get('/contact', function(req, res){
  // http://localhost:3000/contact 주소에 의해 라우팅 메소드가 호출되면 실행될 콜백함수의 기능 구현
  
  // res 객체는 'HTTPResponse' 객체로서 서버에서 클라이언트로 정보를 전달하는 객체! (MVC 패턴의 "View")
  // res.render('뷰 스크립트명') 메소드는 views 폴더 내에 있는 지정된 view *.ejs script 파일을 웹 브라우저에 반환함. 
  res.render('index.ejs'); // 프로젝트 내에서 view 폴더라고 암시적으로 명시했음. 
});


// http://localhost:3000/test 호출 - 주소 체계를 센스있게 설계하자!
router.get('/sample/test/test1', function(req, res){
  res.render('index.ejs');

})

// 라우터 파일은 해당 라우터 파일에 정의된 router를 외부로 반환해 주어야 함!!
module.exports = router;
