import http from "../http-common";

class RoomDataService {
  create(data) {
    return http.post("/room/create", data, { withCredentials: true });
  }
  getRoomData(roomId, password) {
    return http.get(`/room/${roomId}/getroomdata`, { params: { password: password }, withCredentials: true });
  }
  joinRoom(roomId, password) {
    return http.post(`/room/${roomId}/join`, {}, { params: { password: password }, withCredentials: true });
  }
  getCurrentQuestion(roomId, password) {
    return http.get(`/room/${roomId}/getcurrentquestion`, { params: { password: password }, withCredentials: true });
  }
  sendAnswer(answerId, roomId, password) {
    return http.post(`/room/${roomId}/sendanswer`, {answerId}, { params: { password: password }, withCredentials: true });
  }
  joinTeam(teamId, roomId, password) {
    return http.post(`/room/${roomId}/team/${teamId}/join`, {}, { params: { password: password }, withCredentials: true });
  }
  startQuiz(roomId) {
    return http.post(`/room/${roomId}/startquiz`, {}, {withCredentials: true });
  }
  getActiveRooms() {
    return http.get(`/room/getactiverooms`);
  }

  // isUserCreator(roomId) {
  //   return http.get(`/room/${roomId}/isUserCreator`, {withCredentials: true });
  // }
}

export default new RoomDataService();