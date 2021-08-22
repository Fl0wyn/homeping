import http from "../http-common";

class DataService {
  getAll() {
    return http.get("/Apps");
  }

  get(id) {
    return http.get(`/Apps/${id}`);
  }

  create(data) {
    return http.post("/Apps", data);
  }

  update(id, data) {
    return http.put(`/Apps/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Apps/${id}`);
  }

  deleteAll() {
    return http.delete(`/Apps`);
  }

  findByTitle(hostname) {
    return http.get(`/Apps?hostname=${hostname}`);
  }
}

export default new DataService();