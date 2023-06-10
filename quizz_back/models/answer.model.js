module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
      answerText: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    });
  
    return Answer;
  };
  