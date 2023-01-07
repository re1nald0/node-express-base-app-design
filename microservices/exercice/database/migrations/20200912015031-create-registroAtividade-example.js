'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('registroAtividade', { 
      idRegistroAtividade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      descricao: {
            type: DataTypes.STRING(1000)
      },
      horasConsideradas: {
            type: DataTypes.DOUBLE
      },
      idTabelaPontuacaoHelper: {
        type: DataTypes.INTEGER,
      },
      usuarioIdUsuario: {
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'usuario',
          key: 'idUsuario',
          as: 'usuarioIdUsuario'
        }
      },
      pontuacaoIdPontuacao: {
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'pontuacao',
          key: 'idPontuacao',
          as: 'pontuacaoIdPontuacao'
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
    await queryInterface.dropTable('registroAtividade');
  }
};
