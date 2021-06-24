import ApiService from "./api.service";

const SiteService = {
  async getSites() {
    return await ApiService.get('/sites');
  },
  async getSite(id) {
    return await ApiService.get(`/sites/${id}`);
  },
  async deleteSite(id) {
    return await ApiService.delete(`/sites/${id}`);
  },
  async editSite(id, data) {
    return await ApiService.patch(`/sites/${id}`, data);
  },
  async createSite(data) {
    return await ApiService.post(`/sites/`, data);
  },
  async getFreeSites(start, end) {
    return await ApiService.get(`/sites/free/?start=${start}&end=${end}`);
  }
}

export { SiteService };