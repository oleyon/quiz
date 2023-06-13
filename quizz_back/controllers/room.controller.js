const db = require("../models");
const Room = db.room
exports.create = async (req, res) => {
  try {
    const roomreq = req.body;
    roomreq.userId = req.userId;
    const room = await Room.create(roomreq);
    res.status(201).json({data: room, message: 'Room created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create the room' });
  }
};