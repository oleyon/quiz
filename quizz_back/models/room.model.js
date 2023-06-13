module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define("rooms", {
    title: {
      type: Sequelize.STRING
    },
    numberOfTeams: {
      type: Sequelize.INTEGER
    },
    quizTime: {
      type: Sequelize.INTEGER
    },
    startTime: {
      type: Sequelize.DATE,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING
    },
    isFinished: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return Room;
};