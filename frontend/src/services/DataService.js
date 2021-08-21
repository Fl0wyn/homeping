import http from "../http-common";

class DataService {
  getAll() {
    return http.get("/homes");
  }

  get(id) {
    return http.get(`/homes/${id}`);
  }

  create(data) {
    return http.post("/homes", data);
  }

  update(id, data) {
    return http.put(`/homes/${id}`, data);
  }

  delete(id) {
    return http.delete(`/homes/${id}`);
  }

  deleteAll() {
    return http.delete(`/homes`);
  }

  findByTitle(title) {
    return http.get(`/homes?title=${title}`);
  }
}

export default new DataService();