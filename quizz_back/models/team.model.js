module.exports = (sequelize, Sequelize) => {
    const Team = sequelize.define("teams", {
      name: {
        type: Sequelize.STRING
      },
    }, {timestamps: false,});
  
    return Team;
  };