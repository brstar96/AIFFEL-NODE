// 프로젝트 폴더 DAY1 프로젝트에 moment 노드 패키지 참조하기 
// 설치된 노드 패키지를 사용하려면 require()라는 예약어로 참조합니다. 
const moment = require('moment');

console.log("터미널창에 로그 정보를 기록합니다. ");
console.log("현재의 날짜, 시간 정보를 출력합니다. ", Date.now());
console.log("moment package로 내가 원하는 포맷 출력하기", moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'));
