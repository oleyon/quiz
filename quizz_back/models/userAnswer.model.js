module.exports = (sequelize, Sequelize) => {
    const UserAnswer = sequelize.define("rooms", {
      name: {
        type: Sequelize.INTEGER
      },
    }, {timestamps: false,});
  
    return UserAnswer;
  };