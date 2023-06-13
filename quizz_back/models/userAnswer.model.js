module.exports = (sequelize, Sequelize) => {
    const UserAnswer = sequelize.define("rooms", {
      name: {
        type: Sequelize.INTEGER
      },
    });
  
    return UserAnswer;
  };