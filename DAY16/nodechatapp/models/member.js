module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
      'members',
      {
          member_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          comment: '회원고유번호',
        },
        email: {
          type: DataTypes.STRING(100),
          primaryKey: false,
          allowNull: false,
          comment: '사용자메일주소',
        },
        password: {
            type: DataTypes.STRING(200),
            primaryKey: false,
            allowNull: false,
            comment: '단방향암호화가 적용된 암호문자열',
          },
        name: {
            type: DataTypes.STRING(50),
            primaryKey: false,
            allowNull: false,
            comment: '사용자명',
        },
        telephone: {
            type: DataTypes.STRING(50),
            primaryKey: false,
            allowNull: true,
            comment: '전화번호',
          }
      },
      {
         timestamps: true,
         paranoid: true
     });
};
