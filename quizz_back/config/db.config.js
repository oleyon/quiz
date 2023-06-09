module.exports = {
  HOST: "localhost",
  PORT: "25432",
  USER: "diplomeuser",
  PASSWORD: "dbpassword",
  DB: "diplomdb",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};