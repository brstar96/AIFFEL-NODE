// 항상 실행하고 싶은 라우터 미들웨어를 정의해 놓고, 다른 라우터 스크립트에서 참조해서 사용해도 됨. 

exports.checkParams = (req, res, next) => {
    if(req.params.id == undefined){
        console.log("id 파라메터가 전달되지 않았습니다.")
    }else{
        console.log("id 파라메터 값이 전달되었습니다.",req.params.id)
    }
    next();
 };

//  category라는 key가 없으면 console.log 찍기 
// http://localhost:3000/article/list?category=테스트 <- 예컨대 왼쪽과 같은 url 입력 시 'category'가 포함되지 않았을때의 로직 정의 
 exports.checkQueryKey = (req, res, next) => {
    if(req.query.category == undefined){
        console.log("category 키가 전달되지 않았습니다.")
    }
    next();
 };