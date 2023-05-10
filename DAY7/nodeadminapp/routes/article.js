// 게시글 정보 관리를 웹 페이지 요청, 응답 관리를 위한 라우터 스크립트
// 기본 라우팅 주소: localhost:3000/article/~

var express = require('express')
var router = express.Router();

// 게시글 정보 조회 및 조회 결과 웹페이지 요청/응답 처리 라우팅 메소드 
router.get('/list', async(req, res)=>{
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

// 게시글 등록 웹페이지 요청/응답 처리 라우팅 메소드 
router.get('/create', async(req,res)=>{
    res.render('article/create.ejs')
}); // 일단 get으로 불러오고 시작(localhost:3000/article/create)

// // 사용자가 입력한 게시글 등록데이터 처리 요청 및 응답 라우팅 메소드
// router.post();

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
// router.post(); 

// // -- Part3 --

// // 선택 게시글 삭제 처리 요청 및 응답처리 라우팅 메소드 
// router.get();

module.exports = router;