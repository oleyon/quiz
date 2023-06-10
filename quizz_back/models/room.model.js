module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define("rooms", {
    numberOfTeams: {
      type: Sequelize.INTEGER
    },
    quizzTime: {
      type: Sequelize.INTEGER
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return Room;
};