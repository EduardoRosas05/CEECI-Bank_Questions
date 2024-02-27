'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Options', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      option1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      option2: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      option3: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      correctA: {
        type: Sequelize.STRING, 
        allowNull: false,
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
          references: {
            model: 'Questions',
            key: 'id'
          }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Options');
  }
};