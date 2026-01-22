import { ApiHelper } from '../utils/apiHelper.js';
import { API_CONFIG } from '../../config/api.config.js';

export class UserClient {
  constructor(request, authClient) {
    this.apiHelper = new ApiHelper(request);
    this.authClient = authClient;
  }

  async getProfile() {
    const headers = this.authClient.getAuthHeaders();
    return await this.apiHelper.makeRequest('GET', API_CONFIG.ENDPOINTS.USERS.PROFILE, { headers });
  }

  async getAddress() {
    const headers = this.authClient.getAuthHeaders();
    return await this.apiHelper.makeRequest('GET', API_CONFIG.ENDPOINTS.USERS.ADDRESS, { headers });
  }

  async updateAddress(addressData) {
    const headers = this.authClient.getAuthHeaders();
    return await this.apiHelper.makeRequest('PUT', API_CONFIG.ENDPOINTS.USERS.UPDATE_ADDRESS, {
      headers,
      data: addressData
    });
  }
}
