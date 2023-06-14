module.exports = (sequelize, Sequelize) => {
    const Answer = sequelize.define('answers', {
      answerText: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    }, {timestamps: false,});
  
    return Answer;
  };
  