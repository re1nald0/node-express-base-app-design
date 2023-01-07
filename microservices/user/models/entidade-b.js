'use strict'
const models = require('.');

module.exports = (sequelize, DataTypes) => {
    const entidade_b = sequelize.define('entidade_b', {
        entidade_b_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        propriedade_a: {
            type: DataTypes.STRING(2000)
        }
    }, {
        freezeTableName: true,
        tableName: 'entidade_b',
        timestamps: true
    });

    entidade_b.associate = (models) => {
        entidade_b.entidade_a = entidade_b.belongsToMany(models.entidade_a, {
            through: models.entidade_a_b,
            key: 'entidade_b_id'
        });
    }

    return entidade_b;
}