module.exports = (sequelize, Sequelize) => {
    const RoomUser = sequelize.define("user_roles", {
    }, {timestamps: false,});
  
    return RoomUser;
  };