import ApiService from "./api.service";

const CustomerService = {
  async getCustomers() {
    return await ApiService.get('/customers');
  },
  async getCustomer(id) {
    return await ApiService.get(`/customers/${id}`);
  },
  async deleteCustomer(id) {
    return await ApiService.delete(`/customers/${id}`);
  },
  async editCustomer(id, data) {
    return await ApiService.patch(`/customers/${id}`, data);
  },
  async createCustomer(data) {
    return await ApiService.post(`/customers/`, data);
  },
  async getCustomersByUser(id) {
    return await ApiService.get(`/customers/users/${id}`);
  }
}

export { CustomerService };