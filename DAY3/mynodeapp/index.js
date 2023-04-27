const {odd, even} = require('./base1'); // 확장자 생략해도 무방
const checkOddOrEven = require('./base2');

// 문자열을 받아 문자열의 길이가 홀수인지 짝수인지 판단 후 odd/even 문자열 반환
function checkStringOddOrEven(str){
    if(str.length % 2){
        return odd
    }
    return even
}

console.log('숫자 홀짝여부 판단 함수 호출하기 - base2.js에 정의됨:', checkOddOrEven(5))
console.log('문자열 길이 홀짝여부 판단 함수 호출하기 - base2.js에 정의됨:', checkStringOddOrEven('화이팅'))