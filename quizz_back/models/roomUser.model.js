module.exports = (sequelize, Sequelize) => {
  const RoomUser = sequelize.define("room_users", {
    score: {
      type: Sequelize.INTEGER
    },
    teamNumber: {
      type: Sequelize.INTEGER
    },
    currentQuestion: {
      type: Sequelize.INTEGER
    }
  }, {timestamps: false,});

  return RoomUser;
};