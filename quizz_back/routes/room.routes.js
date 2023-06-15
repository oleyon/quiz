const authJwt = require("../middleware/authJwt")
const controller = require("../controllers/room.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/room/create",
    [
      authJwt.verifyToken,
      authJwt.isTeacherOrAdmin
    ],
    controller.create
  );
  app.get(
    "/api/room/:roomId/getroomdata",
    [
      authJwt.verifyToken
    ],
    controller.getRoomData
  );
  app.post(
    "/api/room/:roomId/join",
    [
      authJwt.verifyToken
    ],
    controller.joinRoom
  );
  app.get(
    "/api/room/:roomId/getcurrentquestion",
    [
      authJwt.verifyToken
    ],
    controller.getCurrentQuestion
  );
  app.post(
    "/api/room/:roomId/sendanswer",
    [
      authJwt.verifyToken
    ],
    controller.sendAnswer
  );
  app.post(
    "/api/room/:roomId/team/:teamId/join",
    [
      authJwt.verifyToken
    ],
    controller.joinTeam
  );
  app.get(
    "/api/room/getactiverooms",
    controller.getActiveRooms
  );
  app.post(
    "/api/room/:roomId/startquiz",
    [
      authJwt.verifyToken
    ],
    controller.startQuiz
  );
};