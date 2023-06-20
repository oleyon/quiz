const db = require("../models");
const Room = db.room
const User = db.user
const Team = db.team
exports.create = async (req, res) => {
  try {
    const roomreq = req.body;
    roomreq.userId = req.userId;
    if(roomreq.numberOfTeams < 1) {
      roomreq.numberOfTeams = 1;
    }
    if(roomreq.quizTime < 1) {
      roomreq.quizTime = 60;
    }
    const room = await Room.create(roomreq);
    const teams = [];
    for (let i = 0; i < roomreq.numberOfTeams; i++) {
      const team = await Team.create({ name: `Команда ${i + 1}` });
      teams.push(team);
    }
    // Associate the teams with the room
    await room.addTeams(teams);
    res.status(201).json({data: room, message: 'Комната успешно создана' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось создать комнату' });
  }
};

exports.getRoomData = async (req, res) => {
  try {
    const { roomId } = req.params;
    const password = req.query.password;
    const room = await Room.findOne({
      where: {id: roomId},
      include: [
        {
          model: db.team,
          attributes: ['id', 'name'],
          include: [
            {
              model: db.roomUser,
              attributes: ['score', 'currentQuestion'],
              include: [
                {
                  model: db.user,
                  attributes: ['username', 'name', 'surname']
                }
              ]
            }
          ]
        }
      ]
    });
    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }
    if (room.password && password !== room.password) {
      return res.status(401).json({ message: 'Неправильный пароль для комнаты' });
    }
    roomData = room.toJSON() // TODO
    res.status(200).json(roomData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось найти комнату' });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const password = req.query.password;
    const userId = req.userId;
    const user = await User.findByPk(userId)
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }
    if (room.password && password !== room.password) {
      return res.status(401).json({ message: 'Неправильный пароль для комнаты' });
    }
    let userRoom = await db.roomUser.findOne({
      where: { userId: userId, roomId: roomId },
    });
    if(!userRoom) {
      userRoom = await user.addRoom(room, { through: {score: 0, teamId: null, currentQuestion: 0} })
    }
    res.status(200).json({ message: 'Пользователь присоединился к комнате' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось найти комнату' });
  }
};

exports.getCurrentQuestion = async (req, res) => {
  try {
    const { roomId } = req.params;
    const password = req.query.password;
    const userId = req.userId;
    const room = await Room.findByPk(roomId, {
      include: [
        {
          model: db.quiz,
          include: [
            {
              model: db.question,
              include: [{model: db.answer, attributes: ['id', 'answerText']}]
            }
          ]
        }
      ]
    });
    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }
    if (room.password && password !== room.password) {
      return res.status(401).json({ message: 'Неправильный пароль для комнаты' });
    }
    const userRoom = await db.roomUser.findOne({
      where: { userId: userId, roomId: roomId },
    });
    if (userRoom.teamId == null) {
      return res.status(200).json()
    }
    if (!userRoom) {
      // User is not associated with the room
      return res.status(404).json({ message: 'Пользователь не присоединен к комнате' });
    }
    const remainingTime = calculateTimeLeft(room.startTime, room.quizTime * 1000)
    if(remainingTime < 0) {
      return res.status(200).json()
    }
    else {
      index = userRoom.currentQuestion;
      question = room.quiz.questions[index]
      return res.status(200).json(question);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось найти комнату' });
  }
};

exports.sendAnswer = async (req, res) => {
  try {
    const { roomId } = req.params;
    const password = req.query.password;
    const userId = req.userId;
    const answerId = req.body.answerId;
    const room = await Room.findByPk(roomId, {
      include: [
        {
          model: db.quiz,
          include: [
            {
              model: db.question,
              include: [{model: db.answer, attributes: ['id', 'answerText', 'isCorrect']}]
            }
          ]
        }
      ]
    });
    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }
    if (room.password && password !== room.password) {
      return res.status(401).json({ message: 'Неправильный пароль для комнаты' });
    }
    const remainingTime = calculateTimeLeft(room.startTime, room.quizTime * 1000);
    if(remainingTime < 0) {
      res.status(200).json()
    }
    else {
      const userRoom = await db.roomUser.findOne({
        where: { userId: userId, roomId: roomId },
      });
      if (!userRoom) {
        // User is not associated with the room
        return res.status(404).json({ message: 'Пользователь не присоединен к комнате' });
      }
      answer = await db.answer.findByPk(answerId)
      if (!answer) {
        return res.status(404).json({ message: 'Вопрос не найден' });
      }
      if (answer.isCorrect) {
        userRoom.increment('score', { by: 1 });
      }
      await userRoom.increment('currentQuestion', { by: 1 });
      await userRoom.save();
      index = userRoom.currentQuestion;
      question = room.quiz.questions[index-1]
      res.status(200).json(question);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось найти комнату' });
  }
};

exports.joinTeam = async (req, res) => {
  try {
    let { roomId, teamId } = req.params;
    if (teamId == 'null') {
      teamId = null;
    }
    const password = req.query.password;
    const userId = req.userId;
    const user = await User.findByPk(userId)
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }
    if (room.password && password !== room.password) {
      return res.status(401).json({ message: 'Неправильный пароль для комнаты' });
    }
    
    const userRoom = await db.roomUser.findOne({
      where: { userId: userId, roomId: roomId },
    });
    // TODO
    if(!userRoom) {
      userRoom = await user.addRoom(room, { through: {score: 0, teamId: null, currentQuestion: 0} })
    }
    if(room.startTime == null) {
      userRoom.update({teamId: teamId}, {
        where: {
          userId: userId,
          roomId: roomId
        }
      })
      res.status(200).json({ message: 'Пользователь присоединился к команде' });
    }
    else {
      res.status(200).json({ message: 'Игра уже началась' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось найти комнату' });
  }
};

exports.getActiveRooms = async (req, res) => {
  try {
    rooms = await Room.findAll({
      where: {isFinished: false},
      attributes: ['id', 'title', 'numberOfTeams'],
      include: {
        model: db.quiz,
        attributes: ['title', 'description']
      }
    })
    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось найти открытые комнаты' });
  }
};

exports.startQuiz = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.userId;
  try {
    const room = await Room.findByPk(roomId);
    if (room) {
      const currentDateTime = new Date();
      await room.update({ startTime: currentDateTime });
      // Set isFinished to true after quizTime seconds
      setTimeout(async () => {
        await room.update({ isFinished: true });
      }, room.quizTime * 1000);
      res.status(200).json({ message: `Квиз был начат в ${currentDateTime}` });
    } else {
      res.status(404).json({ message: 'Комната не найдена' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to start the quiz' });
  }
};

exports.setTeamName = async (req, res) => {
  try {
    //const { teamId } = req.params;
    const { roomId } = req.params;
    const { teamName } = req.body;
    const userId = req.userId;
    const roomUser = await db.roomUser.findOne({where: {userId: userId, roomId: roomId}});
    console.log(roomUser)
    const team = await Team.findByPk(roomUser.teamId);
    if (!team) {
      return res.status(404).json({ message: 'Команда не найдена' });
    }

    await team.update({ name: teamName });

    res.status(200).json({ message: 'Название команды успешно изменено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось изменить название команды' });
  }
};


function calculateTimeLeft(startTime, quizTime) {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;
  const remainingTime = quizTime - elapsedTime;
  return remainingTime;
}