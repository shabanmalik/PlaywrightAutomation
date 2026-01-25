import { ApiHelper } from '../utils/apiHelper.js';
import { API_CONFIG } from '../../config/api.config.js';

export class CartClient {
  constructor(request, authClient) {
    this.apiHelper = new ApiHelper(request);
    this.authClient = authClient;
  }

  async getCart() {
    const headers = this.authClient.getAuthHeaders();
    return await this.apiHelper.makeRequest('GET', API_CONFIG.ENDPOINTS.CART.GET, { headers });
  }

  async addItemToCart(productId, quantity = 1) {
    const headers = this.authClient.getAuthHeaders();
    return await this.apiHelper.makeRequest('POST', API_CONFIG.ENDPOINTS.CART.ADD_ITEM, {
      headers,
      data: { product_id: productId, quantity }
    });
  }

  async updateCartItem(itemId, quantity) {
    const headers = this.authClient.getAuthHeaders();
    const endpoint = API_CONFIG.ENDPOINTS.CART.UPDATE_ITEM.replace('{id}', itemId);
    return await this.apiHelper.makeRequest('PUT', endpoint, {
      headers,
      data: { quantity }
    });
  }

  async removeCartItem(itemId) {
    const headers = this.authClient.getAuthHeaders();
    const endpoint = API_CONFIG.ENDPOINTS.CART.DELETE_ITEM.replace('{id}', itemId);
    return await this.apiHelper.makeRequest('DELETE', endpoint, { headers });
  }

  async clearCart() {
    const headers = this.authClient.getAuthHeaders();
    return await this.apiHelper.makeRequest('DELETE', API_CONFIG.ENDPOINTS.CART.CLEAR, { headers });
  }
}
