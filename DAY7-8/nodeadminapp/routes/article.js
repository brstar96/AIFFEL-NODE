// 게시글 정보 관리를 웹 페이지 요청, 응답 관리를 위한 라우터 스크립트
// 기본 라우팅 주소: localhost:3000/article/~
var express = require('express')
var router = express.Router();

// url 주소에서 특정 파라미터(query string) 값이 있고 없고를 체크하는 미들웨어 임포트 
const {checkParams, checkQueryKey} = require('./middleware.js');


//라우터 미들웨어 샘플 1 - 이 라우터 스크립트가 호출되는 순간 무조건 실행되는 미들웨어 
router.use(function (req, res, next) {
    console.log('라우터 미들웨어 샘플1 :', Date.now());
    next();
});

//라우터 미들웨어 샘플 2
router.use('/sample/:id', function(req, res, next) {
    console.log('Index 라우터 미들웨어 샘플2 Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('Index 라우터 미들웨어 샘플3 Request Type:', req.method);
    next();
});

// 게시글 정보 조회 및 조회 결과 웹페이지 요청/응답 처리 라우팅 메소드 
// async 앞에 라우터 미들웨어를 포함하면 먼저 미들웨어 실행 후 뒤의 콜백함수 호출 
router.get('/list', checkQueryKey, async(req, res)=>{ 
    // 전체 게시글 정보를 DB에서 최초 조회해 온다고 가정. 
    var articles = [ 
        { 
            aid:'1', 
            title:'최초 게시글 1 제목입니다.', 
            contents:'최초 게시글 1 내용입니다', 
            view_cnt:1, 
            display_yn:'N', 
            regist_date:Date.now(), 
            regist_user: 'mgl'
        }, 
        { 
            aid:'2', 
            title:'최초 게시글 2 제목입니다.', 
            contents:'최초 게시글 2 내용입니다', 
            view_cnt:1, 
            display_yn:'N', 
            regist_date:Date.now(), 
            regist_user: 'mgl2'
        }, 
        { 
            aid:'3', 
            title:'최초 게시글 3 제목입니다.', 
            contents:'최초 게시글 3 내용입니다', 
            view_cnt:1, 
            display_yn:'N', 
            regist_date:Date.now(), 
            regist_user: 'mgl3'
        }, 
    ];
    
    res.render('article/list.ejs', {articles}); // view 전달
}); // 일단 get으로 불러오고 시작(localhost:3000/article/list)

// 게시글 조회 옵션에 따른 게시글 데이터 조회 처리 요청/응답 라우팅 메소드 
// 사용자가 article/list 페이지에서 조회옵션정보를 입력 및 선택 후 조회 버튼 클릭 시 전달되는 조회 옵션 데이터를 호출해 DB에서 조회 
// 데이터 조회 후 다시 list.ejs 조회 목록 데이터를 전달해주는 라우팅 메소드 
router.post('/list', async(req, res)=>{ // localhost:3000/article/list
    // Step 1. 사용자가 입력/선택한 조회 옵션 form 데이터 추출 
    var title = req.body.title
    var ipaddress = req.body.ipaddress
    var displayyn = req.body.displayyn

    // Step 2. 추출된 조회 옵션 데이터 기반으로 게시글 데이터 테이블에서 게시글 목록 조회해오기 
    var articles = [ // 이 예제에서는 DB에서 조회해 왔다고 가정! (나중에 ERM으로 DB에서 조회하는 과정 추가예정)
        { 
            aid:'1', 
            title:'조회된 게시글 1 제목입니다.', 
            contents:'조회된 게시글 1 내용입니다', 
            view_cnt:1, 
            display_yn:'N', 
            regist_date:Date.now(), 
            regist_user: 'mgl'
        }, 
        // articles를 1개만 넘겨주면 조회 버튼 클릭 시 1개의 게시글만 articles/list에 업데이트될것!
        // { 
        //     aid:'2', 
        //     title:'게시글 2 제목입니다.', 
        //     contents:'게시글 2 내용입니다', 
        //     view_cnt:1, 
        //     display_yn:'N', 
        //     regist_date:Date.now(), 
        //     regist_user: 'mgl2'
        // }, 
        // { 
        //     aid:'3', 
        //     title:'게시글 3 제목입니다.', 
        //     contents:'게시글 3 내용입니다', 
        //     view_cnt:1, 
        //     display_yn:'N', 
        //     regist_date:Date.now(), 
        //     regist_user: 'mgl3'
        // }, 
    ];

    // Step 3. 조회 결과 목록 데이터를 list.ejs 뷰에 전달하기 
    res.render('article/list.ejs', {articles})
}); 

// // -- Part1 --

// 게시글 등록 웹페이지 get 요청/응답 처리 라우팅 메소드 
router.get('/create', async(req,res)=>{
    res.render('article/create.ejs')
}); // 일단 get으로 등록 페이지를 렌더링하고 시작(localhost:3000/article/create)

// 사용자가 입력한 게시글 등록데이터 처리 요청 및 응답 라우팅 메소드
// create.ejs의 <!--우측 콘텐츠 영역 -->에 form 태그로 감싼 부분에서, 버튼 typ을 'submit'으로 설정하고 아래 라우터 주소를 넣었음!

router.post('/create', async(req, res)=>{ // localhost:3000/article/create
    // Step 1.사용자 입력한 게시글 데이터를 form 각 요소로부터 추출
    var title = req.body.title; // req.body에 따라오는 값들은 태그의 name 속성에 입력한 값임!!
    var contents = req.body.contents
    var display_yn = req.body.display_yn

    // Step 2. form에서 전달된 사용자 입력값을 DB의 게시글 테이블에 저장
    // 모든 RDBMS는 INSERT를 통해 데이터를 테이블에 넣게 되어 있으며, 실제 저장된 데이터를 백엔드 호출 메소드로 반환해줌. 
    // 여기서는 INSERT한 후 동일 데이터를 반환받은 게 article이라고 가정 
    var article = {
        aid:'1', 
        title:'새로 게시된 게시글 1 제목입니다.', 
        contents:'새로 게시된 게시글 1 내용입니다', 
        view_cnt:1, 
        display_yn:'N', 
        regist_date:Date.now(), 
        regist_user: 'mgl'
    }

    // 등록완료 후 게시글 리스트 페이지로 리다이렉팅
    // 뷰의 경로가 절대 아닌, 이동 희망하는 도메인을 뺀 주소 기입. 
    res.redirect('/article/list'); 
}); 

// // -- Part2 --

// 단일 게시글 정보 확인 및 수정 페이지 요청, 응답 처리 라우팅 메소드 
// url을 통해 파라미터 방식으로 값 전달하는 경우 와일드카드 설정해 두어야 함. (`:aid`로 번호를 추출해올 수 있도록 와일드카드 셋업)
router.get('/modify/:aid', async(req, res)=>{
    var articleId = req.params.aid; // 게시글 고유 번호를 url에서 추출해옴. 
    var article = { // 해당 게시글 번호에 해당하는 데이터를 게시글 테이블에서 조회해옴. (여기서는 DB에서 가져왔다고 가정)
        aid:'1', 
        title:'게시글 제목입니다.', 
        contents:'게시글 내용입니다', 
        view_cnt:1, 
        display_yn:'N', 
        regist_date:Date.now(), 
        regist_user: 'mgl'
    }; 

    res.render('article/modify.ejs', {article}) // 단일 게시글 데이터(`article`)를 -> 게시글 수정 웹페이지 뷰(ejs)에 전달
}); // localhost:3000/article/modify/1

// // 사용자가 수정한 게시글 정보처리 요청 및 응답 처리 라우팅 메소드
router.post('/modify/:aid', async(req, res)=>{
    // Step 1. 수정하려는 게시글 고유번호 추출 (2가지)
    //  - 방법 1: parameter값을 추출하는 방법 - 파라미터 방식으로 넘겨받는 경우는 req.params 활용
    var aid = req.params.aid;
    //  - 방법 2: form 태그 내 hidden 요소가 있으면 hidden 태그의 name 값으로 추출
    // var aid = req.body.aid;

    // Step 2. 사용자가 수정한 게시글 form 태그 내 요소값들을 추출
    var title = req.body.aid;
    var contents = req.body.contents;
    var display_yn = req.body.display_yn;

    // Step 3. DB의 게시글 정보를 수정 처리하기 - DB에 전달할 수정 데이터를 먼저 정의
    var article = {
        title, 
        contents, 
        display_yn
    }
    // Step 4. 수정 데이터가 DB에 반영 완료되면 게시글 목록 페이지로 이동
    res.redirect('/article/list')
}); 

// // -- Part3 --

// // 선택 게시글 삭제 처리 요청 및 응답처리 라우팅 메소드 
router.get('/delete',async(req, res)=>{
    // 게시글 고유 번호를 추출 (query string으로 넘어온 데이터는 req.query로 접근)
    var aid = req.query.aid;

    // DB의 테이블에서 해당 게시글을 영구 삭제 처리(여기서는 했다고 가정)


    // 게시글 목록 페이지로 다시 이동시키기
    res.redirect('/article/list')

}); // localhost:3000/article/delete?aid=1

module.exports = router;