'use strict'

const models = require('.');

module.exports = (sequelize, DataTypes) => {

    const item = sequelize.define('item', {
        idItem: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descricao: {
            type: DataTypes.STRING(2000)
        }
    }, {
        freezeTableName: true,
        tableName: 'item',
        timestamps: true
    });

    item.associate = (models) => {
        item.organizacaoTabela = item.belongsToMany(models.organizacaoTabela, {
            through: models.pontuacao,
            key: 'itemIdItem'
        });
    }

    return item;
}