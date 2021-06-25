import ApiService from "./api.service";

const RideService = {
    async getAll() {
        return await ApiService.get('/API/ride');
    },
    async getById(id) {
        return await ApiService.get(`/API/ride/${id}`);
    }, 
    async create(data) {
        return await ApiService.post('/API/ride/', data);

    },
    async update(id, data) {
        return await ApiService.patch(`/API/ride/${id}`, data)
    },
    async delete(id) {
        return await ApiService.delete(`/API/ride/${id}`)
    }
}

export { RideService };