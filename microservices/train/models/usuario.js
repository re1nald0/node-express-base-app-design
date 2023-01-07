'use strict'

const models = require('.');

module.exports = (sequelize, DataTypes) => {

    const usuario = sequelize.define('usuario', {
        idUsuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(500)
        },
        registro: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
        isAdministrador: {
            type: DataTypes.BOOLEAN
        },
        nivelAtual: {
            type: DataTypes.INTEGER
        },
        // nivelIdNivel: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: models.nivel,
        //         key: 'idNivel'
        //     }
        // }
    }, {
        freezeTableName: true,
        tableName: 'usuario',
        timestamps: true
    });

    usuario.associate = (models) => {
        // usuario.nivel = usuario.belongsTo(models.nivel);
        // usuario.documento = usuario.hasMany(models.documento, {foreignKey: 'usuarioIdUsuario'});
        // usuario.tabelaPontuacao = usuario.hasMany(models.tabelaPontuacao);
        // usuario.acordoTabelaPontuacao = usuario.hasOne(models.tabelaPontuacao, {foreignKey: 'usuarioIdUsuario'})
        usuario.tabelaPontuacao = usuario.belongsToMany(models.tabelaPontuacao, {
            through: models.tabelasUsuarios,
            key: 'usuarioIdUsuario'
        });
        usuario.registroAtividade = usuario.hasMany(models.registroAtividade, {foreignKey: 'usuarioIdUsuario'});
        usuario.documentoPessoal = usuario.hasMany(models.documentoPessoal, {foreignKey: 'usuarioIdUsuario'});
    }

    return usuario;
}