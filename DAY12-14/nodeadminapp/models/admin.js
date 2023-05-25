module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
    'admin_member', {
        admin_member_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: '관리자 계정 고유번호',
        },
        admin_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: '관리자계정 아이디',
        },
        admin_password: {
            type: DataTypes.STRING(300), // 암호화된 텍스트 저장하기 위해 길게 설정 
            allowNull: false,
            comment: '단방향 암호화 관리자계정 비밀번호',
        },
        admin_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: '관리자 이름',
        },
        reg_date: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: '등록일시',
        },
        reg_member_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '등록자고유번호',
        },
        edit_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: '수정일시',
        },
        edit_member_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '수정자고유번호',
        }
        },

        {
            sequelize,
            tableName: 'admin_member', // 따옴표를 사용하면 단수형으로 테이블 이름 명시 가능 
            timestamps: false,
            comment: '관리자계정정보',
            indexes: [
        {
            name: 'PRIMARY', 
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'admin_member_id' }],
        },
    ],  
    }
);
};