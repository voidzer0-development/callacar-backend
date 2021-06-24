import ApiService from "./api.service";

const UtilityService = {
  async getUtilities() {
    return await ApiService.get('/utilities');
  },
  async getUtility(id) {
    return await ApiService.get(`/utilities/${id}`);
  },
  async deleteUtility(id) {
    return await ApiService.delete(`/utilities/${id}`);
  },
  async editUtility(id, data) {
    return await ApiService.patch(`/utilities/${id}`, data);
  },
  async createUtility(data) {
    return await ApiService.post(`/utilities/`, data);
  }
}

export { UtilityService };