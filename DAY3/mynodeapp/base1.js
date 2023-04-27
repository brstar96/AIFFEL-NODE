// 모듈 파일 안에 변수와 기능을 구현하기 

const odd = '홀수입니다';
const even = '짝수입니다';

function test(){
    console.log('테스트 함수가 호출되었습니다.');
}

// 모듈 파일 안에 정의된 변수/상수/기능을 외부 모듈에서도 사용하기 위해서는 
// module.export={}를 이용, 해당 모듈 내 기능과 변수 등을 노출해 주어야 함. 
// module 노출 시에는 객체 형태로 노출
module.exports = { // 속성명과 변수명이 같으므로 아래와 같이 표현 가능 
    odd, 
    even, 
    test
}