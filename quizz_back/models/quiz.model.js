module.exports = (sequelize, Sequelize) => {
  const Quiz = sequelize.define('quizzes', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING
    }
  });



  return Quiz;
};
