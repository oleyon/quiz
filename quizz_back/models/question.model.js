module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      questionText: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
    return Question;
  };
  