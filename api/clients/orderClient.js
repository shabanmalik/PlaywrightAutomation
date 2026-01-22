import { ApiHelper } from '../utils/apiHelper.js';
import { API_CONFIG } from '../../config/api.config.js';

export class OrderClient {
  constructor(request, authClient) {
    this.apiHelper = new ApiHelper(request);
    this.authClient = authClient;
  }

  async getAllOrders() {
    const headers = this.authClient.getAuthHeaders();
    const response = await this.apiHelper.makeRequest('GET', API_CONFIG.ENDPOINTS.ORDERS.LIST, { headers });
    return Array.isArray(response) ? response : response.data || response.invoices || [];
  }

  async getOrderById(orderId) {
    const headers = this.authClient.getAuthHeaders();
    const endpoint = API_CONFIG.ENDPOINTS.ORDERS.BY_ID.replace('{id}', orderId);
    return await this.apiHelper.makeRequest('GET', endpoint, { headers });
  }

  async createOrder(orderData) {
    const headers = this.authClient.getAuthHeaders();
    return await this.apiHelper.makeRequest('POST', API_CONFIG.ENDPOINTS.ORDERS.CREATE, {
      headers,
      data: orderData
    });
  }
}
