module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define('questions', {
      questionText: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {timestamps: false,});
    return Question;
  };
  