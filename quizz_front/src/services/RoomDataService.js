import http from "../http-common";

class RoomDataService {
  create(data) {
    return http.post("/room/create", data, { withCredentials: true });
  }
}

export default new RoomDataService();