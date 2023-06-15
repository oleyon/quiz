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
const Quiz = db.quiz;
const Question = db.question
const Answer = db.answer

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

async function initial() {
  await Role.create({
    id: 1,
    name: "студент"
  });

  await Role.create({
    id: 2,
    name: "преподаватель"
  });

  await Role.create({
    id: 3,
    name: "админ"
  });

  await User.create({
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

  await User.create({
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

  await Quiz.create({
    title: "quiz1",
    description: "testquiz1",
  })

  await Question.create({
    questionText: "q1",
    quizId: 1,
  })
  await Question.create({
    questionText: "q2",
    quizId: 1,
  })
  await Question.create({
    questionText: "q3",
    quizId: 1,
  })
  
  Answer.create({
    answerText: "1",
    isCorrect: false,
    questionId: 1,
  })
  Answer.create({
    answerText: "2",
    isCorrect: true,
    questionId: 1,
  })
  Answer.create({
    answerText: "3",
    isCorrect: false,
    questionId: 1,
  })
  Answer.create({
    answerText: "4",
    isCorrect: false,
    questionId: 1,
  })
  Answer.create({
    answerText: "q",
    isCorrect: false,
    questionId: 2,
  })
  Answer.create({
    answerText: "w",
    isCorrect: false,
    questionId: 2,
  })
  Answer.create({
    answerText: "e",
    isCorrect: false,
    questionId: 2,
  })
  Answer.create({
    answerText: "r",
    isCorrect: true,
    questionId: 2,
  })
  Answer.create({
    answerText: "z",
    isCorrect: true,
    questionId: 3,
  })
  Answer.create({
    answerText: "x",
    isCorrect: false,
    questionId: 3,
  })
  Answer.create({
    answerText: "c",
    isCorrect: false,
    questionId: 3,
  })
  Answer.create({
    answerText: "v",
    isCorrect: false,
    questionId: 3,
  })

}