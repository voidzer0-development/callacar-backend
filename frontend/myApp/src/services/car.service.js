import ApiService from "./api.service";

const CarService = {
    async getAll() {
        return await ApiService.get('/API/car/');
    },
    async getById(id) {
        return await ApiService.get(`/API/car/${id}`);
    }, 
    async create(data) {
        return await ApiService.post('/API/car/', data);

    },
    async update(id, data) {
        return await ApiService.patch(`/API/car/${id}`, data)
    },
    async delete(id) {
        return await ApiService.delete(`/API/car/${id}`)
    }
}

export { CarService };