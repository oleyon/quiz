import http from "../http-common";

class RoomDataService {
  create(data) {
    return http.post("/room/create", data, { withCredentials: true });
  }
  getRoomData(roomId, password) {
    return http.get("/room/getroomdata", { params: { roomId: roomId, password: password }, withCredentials: true });
  }
  joinRoom(roomId, password) {
    return http.post("/room/join", {}, { params: { roomId: roomId, password: password }, withCredentials: true });
  }
  getCurrentQuestion(roomId, password) {
    return http.get("/room/getcurrentquestion", { params: { roomId: roomId, password: password }, withCredentials: true });
  }
  sendAnswer(answerId, roomId, password) {
    return http.post("/room/sendanswer", {answerId}, { params: { roomId: roomId, password: password }, withCredentials: true });
  }
  joinTeam(teamId, roomId, password) {
    return http.post("/room/team/join", {teamId}, { params: { roomId: roomId, password: password }, withCredentials: true });
  }
}

export default new RoomDataService();