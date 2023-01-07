'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('documentoPessoal', {
      idDocumentoPessoal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      originalName: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      fileName: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      pathServidor: {
        type: DataTypes.STRING(1500),
        allowNull: false
      },
      flagDocumento: {
        type: DataTypes.INTEGER
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
     await queryInterface.dropTable('documentoPessoal');
  }
};
