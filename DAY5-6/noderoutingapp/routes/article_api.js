// 게시글 정보 처리를 담당하는 REST API 라우터 스크립트 
// 기본 주소는 localhost:3000/api/articles

var express = require('express');
var router = express.Router();

// 게시글 전체 목록 조회(localhost:3000/api/articles/list)
// DB를 다루게 되면 무조건 비동기 콜백함수를 써야함!
router.get('/list', async(req, res)=>{
    // Step.1 DB에서 해당 테이블에 대한 모든 데이터 목록을 조회 
    var articles = [
        {
            aid:1,
            title:"게시글 제목1입니다.",
            contents:"게시글 내용1입니다.",
            view_cnt:10,
            display_yn:"Y",
            ip_address:"111.111.111.111",
            modify_date:Date.now(),
            modify_userid:"mgl1"
        },
        {
            aid:2,
            title:"게시글 제목2입니다.",
            contents:"게시글 내용2입니다.",
            view_cnt:12,
            display_yn:"Y",
            ip_address:"122.111.111.111",
            modify_date:Date.now(),
            modify_userid:"mgl2"
        },
        {
            aid:3,
            title:"게시글 제목3입니다.",
            contents:"게시글 내용3입니다.",
            view_cnt:13,
            display_yn:"N",
            ip_address:"123.111.111.111",
            modify_date:Date.now(),
            modify_userid:"mgl3"
        }
    ];

    // 클라이언트에 JSON 데이터 응답 처리
    res.json(articles)

});


// 단일 게시글 등록처리(localhost:3000/api/articles/create)
router.post('/create', async(req, res)=>{
    // 프론트엔드에서 단일 게시글 JSON 데이터를 전달받는 방법을 알아보자: 
    // 단일 게시글 JSON 데이터에서 속성값으로 데이터를 추출 
    console.log('제목값 추출해 보기:', req.body.title);
    var title = req.body.title
    var contents = req.body.contents
    var display_yn = req.body.display_yn
    
    // DB에 저장할 단일 게시글 Data 정의 
    var article = {
        aid:100, 
        title, 
        contents, 
        view_cnt:10, //조회수
        display_yn, // 게시여부
        ip_address: '111.111.111.111',
        modify_date: Date.now(), 
        modify_userid: 'mgl'
    }

    // DB에 해당 article 데이터를 저장 처리 (저장 완료 후 저장된 데이터를 FE에 반환)
    res.json(article)

});

// 단일 게시글 정보 조회(localhost:3000/api/articles/modify?aid=1) modify 주소로 ?aid=1이 넘어올 때 
// 와일드카드 방식으로 정의되는 라우팅 메소드는 항상 스크립트 하단에 위치해야함!!!!!!
router.get('/modify', async(req, res)=>{
    // 게시글 고유번호 추출하기: query string 방식으로 전달되는 경우
    var articleIdx = req.query.aid;

    // DB에서 해당 게시글 고유 번호로 단일 게시글 정보 조회해 오는 경우 
    var article = {
            aid:200, 
            title:'게시글 제목 200입니다.', 
            contents:'게시글 내용 200입니다.', 
            view_cnt:10, //조회수
            display_yn: "Y", // 게시여부
            ip_address: '111.111.111.111',
            modify_date: Date.now(), 
            modify_userid: 'eddy'
    }

    // DB에서 조회해온 단일 JSON 데이터를 클라이언트로 반환하기 
    res.json(article)
});

// 단일 게시글 수정(localhost:3000/api/articles/modify?aid=1)
router.post('/modify', async(req, res)=>{
    // 수정하려는 데이터 추출: FE에서 전달되는 단일 수정 JSON 데이터 추출
    var articleIdx = req.body.aid;
    var title = req.body.title
    var contents = req.body.contents
    var display_yn = req.body.display_yn

    // DB에 수정할 JSON 데이터 정의 
    var article = {
        aid:articleIdx, 
        title,
        contents, 
        display_yn, 
        modify_date:Date.now(), 
        modify_userid:'mgl_modify'
    }

    // DB에 수정 처리: DB 수정 후 결과 데이터 반환하기 
    var result = {
        code:200, 
        message:'수정완료', 
        data:null
    }

    res.json(result)
});

// 단일 게시글 삭제(localhost:3000/api/articles/delete)
// router.post();



module.exports = router; // 외부에 반드시 노출해 주기 