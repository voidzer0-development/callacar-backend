import ApiService from "./api.service";

const ReservationService = {
  async getReservations() {
    return await ApiService.get('/reservations');
  },
  async getReservation(id) {
    return await ApiService.get(`/reservations/${id}`);
  },
  async deleteReservation(id) {
    return await ApiService.delete(`/reservations/${id}`);
  },
  async editReservation(id, data) {
    return await ApiService.patch(`/reservations/${id}`, data);
  },
  async createReservation(data) {
    return await ApiService.post(`/reservations/`, data);
  }
}

export { ReservationService };