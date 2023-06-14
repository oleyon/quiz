const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
var bcrypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
  credentials: true
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// database
const db = require("./models");
const Role = db.role;
const User = db.user;

// db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initial();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to backend." });
});

require('./routes/auth.routes')(app);
require('./routes/quiz.routes')(app);
require('./routes/room.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "студент"
  });

  Role.create({
    id: 2,
    name: "преподаватель"
  });

  Role.create({
    id: 3,
    name: "админ"
  });

  User.create({
    username: "teacher1",
    name: "Иван",
    surname: "Иванов",
    faculty: "факультет1",
    email: "ivanov_ivan@mail.ru",
    password: bcrypt.hashSync("qwerty", 8)
  })
  .then(user => {
    user.setRoles(2)
  })

  User.create({
    username: "student1",
    name: "Александр",
    surname: "Иванов",
    faculty: "факультет2",
    email: "ivanov_alex@mail.ru",
    password: bcrypt.hashSync("qwerty", 8)
  })
  .then(user => {
    user.setRoles(1)
  })
}