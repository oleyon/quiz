const db = require("../models");
const Room = db.room
const User = db.user
exports.create = async (req, res) => {
  try {
    const roomreq = req.body;
    roomreq.userId = req.userId;
    const room = await Room.create(roomreq);
    res.status(201).json({data: room, message: 'Комната успешно создана' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось создать комнату' });
  }
};

exports.getRoomData = async (req, res) => {
  try {
    const roomId = req.query.roomId
    console.log("roomId = " + roomId)
    const room = await Room.findOne({
      where: {id: roomId},
      include: [{ model: db.roomUser, attributes: ['score', 'teamNumber', 'currentQuestion'], include: [{ model: db.user, attributes: ['username']}] }]
    })//(await Room.findByPk(roomId));
    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }
    if (room.password && req.query.password !== room.password) {
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
    const userId = req.userId;
    const roomId = req.query.roomId
    const user = await User.findByPk(userId)
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }
    if (room.password && req.query.password !== room.password) {
      return res.status(401).json({ message: 'Неправильный пароль для комнаты' });
    }
    let userRoom = await db.roomUser.findOne({
      where: { userId: userId, roomId: roomId },
    });
    if(!userRoom) {
      userRoom = await user.addRoom(room, { through: {score: 0, teamNumber: 0, currentQuestion: 0} })
    }
    res.status(200).json({ message: 'Пользователь присоединился к комнате' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось найти комнату' });
  }
};

exports.getCurrentQuestion = async (req, res) => {
  try {
    const userId = req.userId;
    const roomId = req.query.roomId;
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
    if (room.password && req.query.password !== room.password) {
      return res.status(401).json({ message: 'Неправильный пароль для комнаты' });
    }
    const userRoom = await db.roomUser.findOne({
      where: { userId: userId, roomId: roomId },
    });
    if (!userRoom) {
      // User is not associated with the room
      return res.status(404).json({ message: 'Пользователь не присоединен к комнате' });
    }
    index = userRoom.currentQuestion;
    //console.log(`userRoom = ${userRoom.toJSON()}`)
    question = room.quiz.questions[index]
    //console.log(`question = ${question}`)
    //console.log(`room = ${room.toJSON()}`)
    //userRoom = await user.addRoom(room, { through: {score: 0, teamNumber: 0, currentQuestion: 0} })
    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось найти комнату' });
  }
};

exports.sendAnswer = async (req, res) => {
  try {
    const userId = req.userId;
    const roomId = req.query.roomId;
    const answerId = req.body.answerId;
    console.log(`answerId = ${answerId}`)
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
    if (room.password && req.query.password !== room.password) {
      return res.status(401).json({ message: 'Неправильный пароль для комнаты' });
    }
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
    console.log(`answer = ${answer}`)
    userRoom.increment('currentQuestion', { by: 1 });
    await userRoom.save();
    index = userRoom.currentQuestion;
    question = room.quiz.questions[index-1]
    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось найти комнату' });
  }
};

exports.joinTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const roomId = req.query.roomId
    const teamNumber = req.body.teamId
    const user = await User.findByPk(userId)
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Комната не найдена' });
    }
    if (room.password && req.query.password !== room.password) {
      return res.status(401).json({ message: 'Неправильный пароль для комнаты' });
    }
    const userRoom = await db.roomUser.findOne({
      where: { userId: userId, roomId: roomId },
    });
    if(!userRoom) {
      userRoom = await user.addRoom(room, { through: {score: 0, teamNumber: 0, currentQuestion: 0} })
    }
    userRoom.update({teamNumber: teamNumber}, {
      where: {
        userId: userId,
        roomId: roomId
      }
    })
    res.status(200).json({ message: 'Пользователь присоединился к команде' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось найти комнату' });
  }
};