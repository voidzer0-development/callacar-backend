import axios from "axios";
import { TokenService } from "@/services/token.service";

const ApiService = {
  _requestInterceptor: 0,
  _401interceptor: 0,

  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },

  setHeader() {
    axios.defaults.headers.common["Authorization"] = TokenService.getToken();
  },

  removeHeader() {
    delete axios.defaults.headers.common["Authorization"];
  },

  get(resource) {
    return axios.get(resource);
  },

  post(resource, data) {
    return axios.post(resource, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },

  patch(resource, data) {
    return axios.patch(resource, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },

  delete(resource) {
    return axios.delete(resource);
  },

  mount401Interceptor() {
    this._401interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.request.status === 401) {
          TokenService.removeToken();
          location.reload();
        }

        throw error;
      }
    );
  },

  unmount401Interceptor() {
    axios.interceptors.response.eject(this._401interceptor);
  }
}

export default ApiService;
