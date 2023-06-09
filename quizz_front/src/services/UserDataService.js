import http from "../http-common";

class UserDataService {
  register(data) {
    return http.post("/auth/signup", data);
  }
  login(data) {
    return http.post("/auth/signin", data);
  }
}

export default new UserDataService();