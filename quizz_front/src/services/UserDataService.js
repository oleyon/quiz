import http from "../http-common";

class UserDataService {
  register(data) {
    return http.post("/auth/signup", data, { withCredentials: true });
  }
  login(data) {
    return http.post("/auth/signin", data, { withCredentials: true });
  }
  test() {
    http.get("/set-cookie", { withCredentials: true });
  }
  logout() {
    return http.post("/auth/logout", {}, { withCredentials: true });
  }
  refreshToken() {
    return http.post("/auth/refresh", {}, { withCredentials: true });
  }
  getUser() {
    return http.get("/auth/getuser", { withCredentials: true });
  }
}

export default new UserDataService();