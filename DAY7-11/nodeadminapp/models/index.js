const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname,'..','config','config.json'))[env];

// DB Object
const db= {};
// Sequelize ORM object 
const sequelize = new Sequelize(config.database,config.username,config.password,config);

// Sequelize mapping 
db.sequelize = sequelize; //DB연결정보를 포함한 DB제어 객체속성(CRUD)
db.Sequelize = Sequelize; //Sequelize팩키지에서 제공하는 각종 데이터 타입 및 관련 객체정보를 제공함

db.Member = require('./member.js')(sequelize, Sequelize);

//회원모델 모듈파일 참조하고 db속성정의하기
//db.Member = require('./member.js')(sequelize,Sequelize);
//db객체 외부로 노출하기
module.exports = db;