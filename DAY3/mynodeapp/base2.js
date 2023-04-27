// base1.js 모듈을 참조하기: Node.JS에서는 import 예약어(표준 자바)보다 require 예약어를 주로 사용. 
const {odd, even, test} = require('./base1.js');

// 숫자를 입력받아 홀수인지 짝수인지 판단 후 odd/even 문자열 반환
function checkOddOrEven(num){
    if(num%2){ // 0=False, 1=True
        return odd;
    }
    return even;
}

var resultMsg1 = checkOddOrEven(2)
var resultMsg2 = checkOddOrEven(3)

console.log('checkOddOrEven(2) 호출 결과 메시지:', resultMsg1)
console.log('checkOddOrEven(3) 호출 결과 메시지:', resultMsg2)

// base2.js 모듈에서는 함수 기능만 노출 
module.exports = checkOddOrEven