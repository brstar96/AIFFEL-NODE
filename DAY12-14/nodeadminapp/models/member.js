module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'members', {
            member_id: {
                type: DataTypes.INTEGER, 
                autoIncrement: true, 
                primaryKey: true, 
                allowNull: false, 
                comment: '회원고유번호'
            }, 
            email: {
                type: DataTypes.STRING(100), 
                primaryKey: false, 
                allowNull: false, 
                comment: '회원고유번호'
            }
        }, 
        {
            timestanps: true, 
            paranoid: true
        }
    );
};