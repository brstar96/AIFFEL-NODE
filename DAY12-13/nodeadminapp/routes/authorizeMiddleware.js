// 현재 사용자가 로그인 상태인지 체크하는 미들웨어 

exports.isLoggedIn = (req, res, next) => {
    // 세션 객체에 isLogined 속성이 없으면 로그인 페이지로 이동
    if (req.session.isLogined == undefined){
        res.redirect('/login')
    }else{
        // isLogined 속성이 존재하면 다음 호출 상태로 이동(원래 프로세스로 돌아감)
        next()
    }
}