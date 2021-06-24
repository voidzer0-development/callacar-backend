import ApiService from "./api.service";

const FacilityService = {
  async getFacilities() {
    return await ApiService.get('/facilities');
  },
  async getFacility(id) {
    return await ApiService.get(`/facilities/${id}`);
  },
  async deleteFacility(id) {
    return await ApiService.delete(`/facilities/${id}`);
  },
  async editFacility(id, data) {
    return await ApiService.patch(`/facilities/${id}`, data);
  },
  async createFacility(data) {
    return await ApiService.post(`/facilities/`, data);
  }
}

export { FacilityService };