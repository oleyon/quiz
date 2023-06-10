const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/authJwt");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/logout", controller.logout);

  app.post("/api/auth/refresh", controller.refreshToken);

  app.get("/api/auth/getuser",
  [
    verifyToken
  ],
   controller.getUser);
};