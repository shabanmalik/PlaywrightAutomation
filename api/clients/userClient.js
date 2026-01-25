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

  async updateAddress(addressData, userId) {
    const headers = this.authClient.getAuthHeaders();
    const currentProfile = await this.getProfile();
    
    const updateData = {
      first_name: currentProfile.first_name,
      last_name: currentProfile.last_name,
      email: currentProfile.email,
      phone: currentProfile.phone || '',
      dob: currentProfile.dob || '2000-01-01',
      address: {
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        postal_code: addressData.postal_code || addressData.zip_code
      }
    };
    
    const endpoint = API_CONFIG.ENDPOINTS.USERS.UPDATE_ADDRESS.replace('{id}', userId);
    return await this.apiHelper.makeRequest('PUT', endpoint, {
      headers,
      data: updateData
    });
  }
}
