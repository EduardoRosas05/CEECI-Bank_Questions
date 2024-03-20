'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGameGroups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.UserGameGroups.hasMany(models.User,
        {
        as: 'GameGroupsUser',
        foreignKey:'userId'
        }
      )
      models.UserGameGroups.hasMany(models.GameGroups,
        {
        as: 'UserGameGroupsPlayer',
        foreignKey:'groupId'
        }
      )
    }
  }
  UserGameGroups.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserGameGroups',
  });
  return UserGameGroups;
};