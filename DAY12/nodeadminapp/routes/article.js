// 게시글 정보 관리를 웹 페이지 요청, 응답 관리를 위한 라우터 스크립트
// 기본 라우팅 주소: localhost:3000/article/~
var moment = require('moment')
var express = require('express')
var router = express.Router();

var db = require('../models/index.js');
var { Op } = require('sequelize') // ORM 오퍼레이터 객체(조건연산자) 참조 
const { QueryTypes} = db.sequelize;
const article = require('../models/article.js');

// 게시글 정보 조회 및 조회 결과 웹페이지 요청/응답 처리 라우팅 메소드 
router.get('/list', async(req, res)=>{
    // DB 객체를 참조하기 (ORM operator 문법을 써야 DB 컨디셔닝 가능) 
    // SELECT article_id, title, ip_address, is_display_code, view_count, reg_date, reg_member_id FROM article
    // WHERE article_id > 0 ORDER BY view_count DESC;
    var articles = await db.Article.findAll({
        attributes:['article_id', 'title', 'ip_address', 'is_display_code', 'view_count', 'reg_date', 'reg_member_id'],
        where:{article_id:{[Op.gt]: 0}}, // ORM 오퍼레이터를 통해 0 보다 큰 데이터 컨디셔닝 
        order : [['view_count', 'DESC']] // 정렬
    });

    // 전체 게시글 개수 가져오기(articles len찍는게 더 낫지만, 여기서는 count 메소드 튜토리얼을 위해 아래 구문 실행)
    var totalCount = await db.Article.count({
        where:{article_id:{[Op.gt]: 0}}, // ORM 오퍼레이터를 통해 0 보다 큰 데이터 컨디셔닝 
    });


    res.render('article/list.ejs', {articles, moment, totalCount}); // view 전달
}); // 일단 get으로 불러오고 시작(localhost:3000/article/list)

// 게시글 조회 옵션에 따른 게시글 데이터 조회 처리 요청/응답 라우팅 메소드 
// 사용자가 article/list 페이지에서 조회옵션정보를 입력 및 선택 후 조회 버튼 클릭 시 전달되는 조회 옵션 데이터를 호출해 DB에서 조회 
// 데이터 조회 후 다시 list.ejs 조회 목록 데이터를 전달해주는 라우팅 메소드 
router.post('/list', async(req, res)=>{ // localhost:3000/article/list
    // Step 1. 사용자가 입력/선택한 조회 옵션 form 데이터 추출 
    var title = req.body.title
    var ipaddress = req.body.ipaddress
    var displayyn = req.body.displayyn

    // db에서 게시글 조회하기 
    var articles = await db.Article.findAll({
        where:{
            title:title
        }
    });

    // 전체 게시글 개수 가져오기(articles len찍는게 더 낫지만, 여기서는 count 메소드 튜토리얼을 위해 아래 구문 실행)
    var totalCount = await db.Article.count({
        where:{article_id:{[Op.gt]: 0}}, // ORM 오퍼레이터를 통해 0 보다 큰 데이터 컨디셔닝 
    });

    // Step 3. 조회 결과 목록 데이터를 list.ejs 뷰에 전달하기 
    res.render('article/list.ejs', {articles, moment, totalCount})
}); 

// // -- Part1 --

// 게시글 등록 웹페이지 get 요청
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
    // 테이블에 저장할 데이터의 속성은 반드시 해당 모델의 속성명과 일치해야 함!!!
    var article = {
        board_type_code: 2,
        title: title, 
        article_type_code: 0,
        contents: contents, 
        view_count: 1, 
        ip_address: '111.123.456.000',
        is_display_code: display_yn,
        reg_date: Date.now(), 
        reg_member_id: 1
    }

    var article = await db.Article.create(article); // SQL의 INSERT INTO와 동일 

    // 등록완료 후 게시글 리스트 페이지로 리다이렉팅
    // 뷰의 경로가 절대 아닌, 이동 희망하는 도메인을 뺀 주소 기입. 
    res.redirect('/article/list'); 
}); 

// // -- Part2 --

// 단일 게시글 정보 확인 및 수정 페이지 요청, 응답 처리 라우팅 메소드 
// url을 통해 파라미터 방식으로 값 전달하는 경우 와일드카드 설정해 두어야 함. (`:aid`로 번호를 추출해올 수 있도록 와일드카드 셋업)
// localhost:3000/article/modify/1
router.get('/modify/:aid', async(req, res)=>{
    var articleId = req.params.aid; // 게시글 고유 번호를 url에서 추출해옴. 
    
    // 게시글번호로 수정대상 글 조회 (방법 1.)
    // var article = await db.Article.findOne({where:{
    //     article_id:articleId
    // }})

    // 게시글번호로 수정대상 글 조회 (방법 2. ORM을 통해 SQL 쿼리로 가져오기)
    // SQL 쿼리를 직접 전달하면 실행 결과가 배열 형태로 리턴 
    var sqlQuery =`SELECT * FROM article WHERE article_id='${articleId}';`
    var articles= await db.sequelize.query(sqlQuery,{
            raw: true,
            type: QueryTypes.SELECT,
    });
    
    // 단일 게시글 추출하기 
    var article = {};
    
    if (articles.length > 0){
        article = articles[0];
    }

    // 조회수 1 더하기 적용
    await db.Article.update({view_count:article.view_count+1}, {where:{article_id:articleId}})

    res.render('article/modify.ejs', {article}) // 단일 게시글 데이터(`article`)를 -> 게시글 수정 웹페이지 뷰(ejs)에 전달
}); // localhost:3000/article/modify/1

// // 사용자가 수정한 게시글 정보처리 요청 및 응답 처리 라우팅 메소드
router.post('/modify/:aid', async(req, res)=>{
    // Step 1. 수정하려는 게시글 고유번호 추출 (2가지)
    //  - 방법 1: parameter값을 추출하는 방법 - 파라미터 방식으로 넘겨받는 경우는 req.params 활용
    var articleId = req.params.aid;
    //  - 방법 2: form 태그 내 hidden 요소가 있으면 hidden 태그의 name 값으로 추출
    // var aid = req.body.aid;

    // Step 2. 사용자가 수정한 게시글 form 태그 내 요소값들을 추출
    var title = req.body.title;
    var contents = req.body.contents;
    var display_yn = req.body.display_yn;

    // Step 3. DB의 게시글 정보를 수정 처리하기 - DB에 전달할 수정 데이터를 먼저 정의
    var article = {
        title, 
        contents, 
        is_display_code:display_yn, 
        edit_date:Date.now(), 
        edit_member_id:1
    }

    // DB에 수정 처리 
    var updated_cnt = await db.Article.update(article, {
        where:{
            article_id:articleId, 
        }
    })

    // Step 4. 수정 데이터가 DB에 반영 완료되면 게시글 목록 페이지로 이동
    res.redirect('/article/list')
}); 

// // -- Part3 --

// // 선택 게시글 삭제 처리 요청 및 응답처리 라우팅 메소드 
router.get('/delete', async(req, res)=>{
    // 게시글 고유번호 추출
    var aid = req.query.aid;

    // DB에서 해당 게시글 영구삭제
    await db.Article.destroy({where:{
        article_id:aid
    }})

    // 게시글 목록 페이지로 이동
    res.redirect('/article/list')

});

module.exports = router;