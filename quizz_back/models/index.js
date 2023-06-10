const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    port: config.PORT,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.quiz = require('./quiz.model.js')(sequelize, Sequelize);
db.question = require('./question.model.js')(sequelize, Sequelize);
db.answer = require('./answer.model.js')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
db.answer.belongsTo(db.question, {
  foreignKey: {
      allowNull: false
  },
  onDelete: 'CASCADE'
});
db.question.belongsTo(db.quiz, {
  foreignKey: {
      allowNull: false
  },
  onDelete: 'CASCADE'
});
db.question.hasMany(db.answer, {
  onDelete: 'CASCADE'
});
db.quiz.hasMany(db.question, {
  onDelete: 'CASCADE'
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;