// 커스텀 모델 스크립트(물리적인 테이블 구조와 똑같은 객체를 생성)

module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
    'member', // Node에서는 자동으로 무조건 테이블 이름을 복수로 생성함. 
    {
        member_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: '회원고유번호',
        },
        email: {
            type: DataTypes.STRING(100), //mySQL에서는 'varChar100'
            primaryKey: false,
            allowNull: false,
            comment: '사용자메일주소',
        }
    },
        {
            timestamps: true, // createdAt, updatedAt column 자동 생성
            paranoid: true // 데이터 삭제 시 물리 테이블에서 삭제하지 않고 삭제된것처럼 보여주는 옵션 
            // 회원 테이블 등 (deletedAt column과 삭제 날짜 자동 생성)
        }
    );
};