'use strict'
const models = require('.');

module.exports = (sequelize, DataTypes) => {
    const entidade_a = sequelize.define('entidade_a', {
        entidade_a_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        propriedade_a: {
            type: DataTypes.STRING
        },
        propriedade_b: {
            type: DataTypes.STRING
        },
        propriedade_c: {
            type: DataTypes.INTEGER
        },
        propriedade_d: {
            type: DataTypes.INTEGER
        },
        entidade_b_id: {
            type: DataTypes.INTEGER,
            references: {
                model: models.entidade_b,
                key: 'entidade_b_id'
            }
        },
        // deliberacaoIdDeliberacao: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: models.deliberacao,
        //         key: 'idDeliberacao'
        //     }
        // }
    }, {
        freezeTableName: true,
        tableName: 'entidade',
        timestamps: true
    });

    entidade_a.associate = (models) => {
        entidade_a.entidade_b = entidade_a.belongsTo(models.entidade_b);
        // entidade_a.nivel = entidade_a.hasMany(models.nivel, {foreignKey: 'entidadeIdentidade'});
        // entidade_a.usuario = entidade_a.hasMany(models.usuario, {foreignKey: 'entidadeIdentidade'});
        // entidade_a.deliberacao = entidade_a.belongsTo(models.deliberacao);
    }

    return entidade_a;
}