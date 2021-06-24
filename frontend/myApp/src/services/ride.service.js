import ApiService from "./api.service";

const RideService = {
    async getAll() {
        return await ApiSerice.get('/user');
    },
    async getById(id) {
        return await ApiSerice.get(`/user/${id}`);
    }, 
    async create(data) {
        return await ApiSerice.get('/user', data);

    },
    async update(id, data) {
        return await Apiservice.patch(`/user/${id}`, data)
    },
    async delete(id) {
        return await ApiService.delete(`/user/${id}`)
    }
}

export { RideService};