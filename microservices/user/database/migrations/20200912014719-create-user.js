'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('usuario', { 
      idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      registro: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isAdministrador: {
        type: DataTypes.BOOLEAN
      },
      nivelAtual: {
        type: DataTypes.INTEGER
      },
      nivelIdNivel: {
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        references: {
          model: 'nivel',
          key: 'idNivel',
          as: 'nivelIdNivel'
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
    await queryInterface.dropTable('usuario');
  }
};
