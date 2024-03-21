'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameGroups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.GameGroups.hasMany(models.UserGameGroups,
        {
        as: 'GameGroupsPlayer',
        foreignKey:'groupId'
        }
      )
    }
  }
  GameGroups.init({
    groupName: DataTypes.STRING,
    maxPlayers: DataTypes.STRING,
    currentPlayers: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GameGroups',
  });
  return GameGroups;
};