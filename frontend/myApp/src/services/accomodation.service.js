import ApiService from "./api.service";

const AccomodationService = {
  async getAccomodations() {
    return await ApiService.get('/accomodations');
  },
  async getAccomodation(id) {
    return await ApiService.get(`/accomodations/${id}`);
  },
  async deleteAccomodation(id) {
    return await ApiService.delete(`/accomodations/${id}`);
  },
  async editAccomodation(id, data) {
    return await ApiService.patch(`/accomodations/${id}`, data);
  },
  async createAccomodation(data) {
    return await ApiService.post(`/accomodations/`, data);
  }
}

export { AccomodationService };