const path = require('path');
const Sequelize = require('sequelize');

//개발모드 환경설정
const env = process.env.NODE_ENV || 'development';

//DB연결 환경설정정보 변경처리//관련정보 수정
const config = require(path.join(__dirname,'..','config','config.json'))[env];

//빈 데이터 베이스 객체(컨트롤러에서 제일 많이 활용)
const db= {};

//DB연결정보로 시퀄라이즈 ORM 객체 생성 (`new Sequelize`로 `sequelize` 인스턴스 생성)
const sequelize = new Sequelize(config.database,config.username,config.password,config);
//DB 처리 객체에 시퀄라이즈 정보 맵핑처리
//이후 DB객체를 통해 데이터 관리가능해짐

db.sequelize = sequelize; //DB연결정보를 포함한 DB제어 객체속성(CRUD을 db 객체에 동적으로 할당(MySQL 서버와 연결, 제어 담당)
db.Sequelize = Sequelize; //Sequelize 패키지에서 제공하는 각종 데이터 타입 및 관련 객체정보를 제공함(common info를 담고 있는 ORM 그 자체)

//회원모델 모듈파일 참조하고 db속성정의하기 (아래 구문이 실행되면 테이블이 생성됨.)
// Member 속성에 sequelize, Sequelize 전달
// models/member.js에 function (sequelize, DataTypes)로 선언했음!!
db.Member = require('./member.js')(sequelize,Sequelize);

//db객체 외부로 노출하기
module.exports = db;