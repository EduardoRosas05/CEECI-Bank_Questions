'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Question.belongsTo(models.Bank, {
        as: 'QuestionBank',
        foreignkey:'bankId'
        }
      )
      models.Question.belongsTo(models.Category, {
        as: 'QuestionCategory',
        foreignkey:'categoryId'
        }
      )
      models.Question.belongsTo(models.Option, {
        as: 'QuestionOption',
        foreignkey:'questionId'
        }
      )
      models.Question.belongsTo(models.Answer, {
        as: 'QuestionAnswer',
        foreignkey:'questionId'
        }
      )
    }
  }
  Question.init({
    textQuestion: DataTypes.STRING,
    bankId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};