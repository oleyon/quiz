import http from "../http-common";

class QuizDataService {
  create(data) {
    return http.post("/quiz/create", data, { withCredentials: true });
  }
}

export default new QuizDataService();