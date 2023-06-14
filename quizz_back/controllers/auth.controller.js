const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    name: req.body.name,
    surname: req.body.surname,
    faculty: req.body.faculty,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.status(200).send({ message: "Успешная регистрация" });
          });
        });
      } else {
        user.setRoles([1]).then(() => {
          res.status(200).send({ message: "Успешная регистрация!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Неверный пароль!"
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
        expiresIn: 604800 // 7 days
      });
      res.cookie('accessToken', token, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(403).send({ message: "No refresh token provided!" });
  }
  jwt.verify(refreshToken, config.refreshSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid refresh token!" });
    }
    var token = jwt.sign({ id: decoded.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });
    res.cookie('accessToken', token, { httpOnly: true });
    res.status(200).send({ accessToken: token });
  });
};

exports.logout = (req, res) => {
  // Invalidate tokens and clear cookies
  res.clearCookie("accessToken", { path: "/", httpOnly: true });
  res.clearCookie("refreshToken", { path: "/", httpOnly: true });
  res.status(200).send({ message: "Logout successful" });
};

exports.getUser = (req, res) => {
  const userId = req.userId;
  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          username: user.username,
          name: user.name,
          surname: user.surname,
          faculty: user.faculty,
          email: user.email,
          roles: authorities
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};