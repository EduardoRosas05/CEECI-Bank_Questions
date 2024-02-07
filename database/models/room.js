'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Room.belongsTo(models.User, {
        as: 'RoomUser',
        foreignkey:'userId'
        }
      )
      models.Room.belongsTo(models.Result, {
        as: 'RoomResult',
        foreignkey:'roomId'
        }
      )
      models.Room.belongsTo(models.Bank, {
        as: 'RoomBank',
        foreignkey:'roomId'
        }
      )
    }
  }
  Room.init({
    name: DataTypes.STRING,
    keyRoom: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};