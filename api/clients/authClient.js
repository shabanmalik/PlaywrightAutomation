import { ApiHelper } from '../utils/apiHelper.js';
import { TokenManager } from '../utils/tokenManager.js';
import { API_CONFIG } from '../../config/api.config.js';

export class AuthClient {
  constructor(request) {
    this.apiHelper = new ApiHelper(request);
    this.tokenManager = new TokenManager();
  }

  async login(email, password) {
    const response = await this.apiHelper.makeRequest('POST', API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      data: { email, password }
    });
    
    if (response.access_token) {
      this.tokenManager.setToken(response.access_token, response.expires_in);
    }
    
    return response;
  }

  async register(userData) {
    return await this.apiHelper.makeRequest('POST', API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      data: userData
    });
  }

  async logout() {
    const headers = this.tokenManager.getAuthHeader();
    await this.apiHelper.makeRequest('POST', API_CONFIG.ENDPOINTS.AUTH.LOGOUT, { headers });
    this.tokenManager.clearToken();
  }

  getAuthHeaders() {
    return this.tokenManager.getAuthHeader();
  }

  getToken() {
    return this.tokenManager.getToken();
  }
}
