'use strict'

const models = require('.');

module.exports = (sequelize, DataTypes) => {

    const organizacaoTabela = sequelize.define('organizacaoTabela', {
        idOrganizacaoTabela: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pontuacaoMinimaExigida: {
            type: DataTypes.DOUBLE
        },
        valorSaturacao: {
            type: DataTypes.DOUBLE
        },
        levaExcedente: {
            type: DataTypes.BOOLEAN
        },
        tabelaPontuacaoIdTabelaPontuacao: {
            type: DataTypes.INTEGER,
            references: {
                model: models.tabelaPontuacao,
                key: 'idTabelaPontuacao'
            }
        },
        grupoSubgrupoIdGrupoSubgrupo: {
            type: DataTypes.INTEGER,
            references: {
                model: models.grupoSubgrupo,
                key: 'idGrupoSubgrupo'
            }
        },
        organizacaoTabelaIdOrganizacaoTabela: {
            type: DataTypes.INTEGER,
            references: {
                model: models.organizacaoTabela,
                key: 'idOrganizacaoTabela'
            }
        }
    }, {
        freezeTableName: true,
        tableName: 'organizacaoTabela',
        timestamps: true
    });

    organizacaoTabela.associate = (models) => {
        organizacaoTabela.item = organizacaoTabela.belongsToMany(models.item, {
            through: models.pontuacao,
            key: 'organizacaoTabelaIdOrganizacaoTabela'
        });
        organizacaoTabela.subgrupos = organizacaoTabela.hasMany(models.organizacaoTabela, {
            foreignKey: 'organizacaoTabelaIdOrganizacaoTabela'
        });
        // organizacaoTabela.saturacaoGrupo = organizacaoTabela.hasMany(models.saturacaoGrupo, {
        //     foreignKey: 'organizacaoTabelaIdOrganizacaoTabela'
        // });
        organizacaoTabela.nome = organizacaoTabela.belongsTo(models.grupoSubgrupo);
        organizacaoTabela.bind = organizacaoTabela.hasMany(models.organizacaoTabelaBind, {
            foreignKey: 'organizacaoTabelaIdOrganizacaoTabela'
        });
    }

    return organizacaoTabela;
}