import ApiService from "./api.service";
import { TokenService } from "./token.service";

class AuthenticationError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    if (message != null) {
      this.message = message;
    }
    this.errorCode = errorCode;
  }
}

// In-memory user storage might not be the safest ever, but it's safer than
// saving it for example LocalStorage, so do this for now. In prod I would
// have an API-sided cache and just fetch it every request.
let user = null;

const AuthService = {
  async login(email, password) {
    try {
      const response = await ApiService.post("/login", {
        email: email,
        password: password
      });

      TokenService.saveToken(response.data.token);
      ApiService.setHeader();
      ApiService.mount401Interceptor();

      return response.data.token;
    } catch (error) {
      this.catchError(error);
    }
  },

  async register(name, email, password) {
    try {
      const response = await ApiService.post("/register", {
        name: name,
        email: email,
        password: password,
        is_admin: false
      });

      TokenService.saveToken(response.data.token);
      ApiService.setHeader();
      ApiService.mount401Interceptor();

      return response.data.token;
    } catch (error) {
      this.catchError(error);
    }
  },

  async getUser() {
    try {
      if (!user && TokenService.getToken()) {
        try {
          const response = await ApiService.get("/me");
          user = {
            "id": response.data.id,
            "name": response.data.name,
            "email": response.data.email,
            "is_admin": response.data.is_admin || false,
          };
        } catch (error) {
          // Handled by 401 interceptor.
        }
      }

      return user;
    } catch (error) {
      this.catchError(error);
    }
  },

  logout() {
    TokenService.removeToken();
    ApiService.removeHeader();
    ApiService.unmount401Interceptor();
  },

  catchError(error) {
    let status;
    let description;

    if (error.response === undefined) {
      status = error.message;
      description = error.message;
    } else {
      status = error.response.status;
      description = error.response.data.message;
    }

    throw new AuthenticationError(status, description);
  },
}

export { AuthService, AuthenticationError };
