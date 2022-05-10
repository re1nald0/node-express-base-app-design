'use strict'

const models = require('.');

module.exports = (sequelize, DataTypes) => {

    const classe = sequelize.define('classe', {
        idClasse: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nomeClasse: {
            type: DataTypes.STRING
        },
        denominacao: {
            type: DataTypes.STRING
        },
        flagOrdenacao: {
            type: DataTypes.INTEGER
        },
        qtNiveis: {
            type: DataTypes.INTEGER
        },
        // tipoCarreiraIdTipoCarreira: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: models.tipoCarreira,
        //         key: 'idTipoCarreira'
        //     }
        // },
        // deliberacaoIdDeliberacao: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: models.deliberacao,
        //         key: 'idDeliberacao'
        //     }
        // }
    }, {
        freezeTableName: true,
        tableName: 'classe',
        timestamps: true
    });

    classe.associate = (models) => {
        // classe.tipoCarreira = classe.belongsTo(models.tipoCarreira);
        // classe.nivel = classe.hasMany(models.nivel, {foreignKey: 'classeIdClasse'});
        // classe.usuario = classe.hasMany(models.usuario, {foreignKey: 'classeIdClasse'});
        // classe.deliberacao = classe.belongsTo(models.deliberacao);
    }

    return classe;
}