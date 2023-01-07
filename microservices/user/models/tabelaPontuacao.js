'use strict'

const models = require('.');

module.exports = (sequelize, DataTypes) => {

    const tabelaPontuacao = sequelize.define('tabelaPontuacao', {
        idTabelaPontuacao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descricao: {
            type: DataTypes.STRING(500)
        },
        pontuacaoAprovacao: {
            type: DataTypes.DOUBLE
        },
        pontuacaoAtual: {
            type: DataTypes.DOUBLE
        },
        // deliberacaoIdDeliberacao: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: models.deliberacao,
        //         key: 'idDeliberacao'
        //     }
        // },
        // usuarioIdUsuario: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: models.usuario,
        //         key: 'idUsuario'
        //     }
        // }
    }, {
        freezeTableName: true,
        tableName: 'tabelaPontuacao',
        timestamps: true
    });

    tabelaPontuacao.associate = (models) => {
        // tabelaPontuacao.deliberacao = tabelaPontuacao.belongsTo(models.deliberacao);
        tabelaPontuacao.grupos = tabelaPontuacao.belongsToMany(models.grupoSubgrupo, {
            through: models.organizacaoTabela,
            key: 'tabelaPontuacaoIdTabelaPontuacao'
        });
        // tabelaPontuacao.usuario = tabelaPontuacao.belongsTo(models.usuario);
        tabelaPontuacao.usuario = tabelaPontuacao.belongsToMany(models.usuario, {
            through: models.tabelasUsuarios,
            key: 'tabelaPontuacaoIdTabelaPontuacao'
        });
    }

    return tabelaPontuacao;
}