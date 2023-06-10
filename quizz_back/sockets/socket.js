// socket.js

const { Room } = require('../models');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // User joins a room
    socket.on('joinRoom', async ({ roomCode, password, user }) => {
      try {
        // Authenticate the user if necessary (e.g., check password)

        // Validate room code and retrieve the room from the database
        const room = await Room.findOne({ where: { roomCode } });
        if (!room) {
          // Handle room not found
          return;
        }

        // Add the user to the WebSocket room
        socket.join(room.roomCode);

        // Store the room status and user details in memory
        // You can use an object or Map to track the room status, user scores, etc.
        // For example:
        // rooms[room.roomCode] = {
        //   quizId: room.quizId,
        //   numTeams: room.numTeams,
        //   quizTime: room.quizTime,
        //   users: [
        //     { id: user.id, name: user.name, score: 0 },
        //     ...
        //   ],
        //   ...
        // };

        // Broadcast room updates to all connected clients in the room
        io.to(room.roomCode).emit('roomUpdate', { room });
      } catch (error) {
        console.error(error);
        // Handle any errors
      }
    });
    socket.on('startGame', ({ roomCode }) => {
      try {
        // Retrieve the room status from memory or database
        const room = getRoomStatus(roomCode);

        // Send the quiz questions one by one to all connected clients
        room.questions.forEach((question, index) => {
          setTimeout(() => {
            io.to(room.roomCode).emit('newQuestion', { question });

            // Set a timer for the quiz duration (quizTime)
            setTimeout(() => {
              // Handle the end of the question timer
              // Move to the next question or end the game if all questions have been answered
              handleQuestionTimerEnd(room, index + 1);
            }, room.quizTime);
          }, index * 1000); // Delay between questions (adjust as needed)
        });
      } catch (error) {
        console.error(error);
        // Handle any errors
      }
    });
    // Other socket event handlers for gameplay, answering questions, etc.
    // Implement the necessary logic based on your requirements
  });
};
