//const { verifySignUp } = require("../middleware");
const authJwt = require("../middleware/authJwt")
const controller = require("../controllers/quiz.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/quiz/create",
    [
      authJwt.verifyToken,
      authJwt.isModeratorOrAdmin
    ],
    controller.create
  );
};