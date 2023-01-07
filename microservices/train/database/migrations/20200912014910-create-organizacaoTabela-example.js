'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('organizacaoTabela', { 
      idOrganizacaoTabela: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'tabelaPontuacao',
          key: 'idTabelaPontuacao',
          as: 'tabelaPontuacaoIdTabelaPontuacao'
        }
      },
      organizacaoTabelaIdOrganizacaoTabela: {
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'organizacaoTabela',
          key: 'idOrganizacaoTabela',
          as: 'organizacaoTabelaIdOrganizacaoTabela'
        }
      },
      grupoSubgrupoIdGrupoSubgrupo: {
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'grupoSubgrupo',
          key: 'idGrupoSubgrupo',
          as: 'grupoSubgrupoIdGrupoSubgrupo'
        }
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('organizacaoTabela');
  }
};
