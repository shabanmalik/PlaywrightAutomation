import { ApiHelper } from '../utils/apiHelper.js';
import { API_CONFIG } from '../../config/api.config.js';

export class ProductClient {
  constructor(request, authClient) {
    this.apiHelper = new ApiHelper(request);
    this.authClient = authClient;
  }

  async getAllProducts() {
    const response = await this.apiHelper.makeRequest('GET', API_CONFIG.ENDPOINTS.PRODUCTS.LIST);
    return Array.isArray(response) ? response : response.data || response.products || [];
  }

  async getProductById(id) {
    const endpoint = API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID.replace('{id}', id);
    return await this.apiHelper.makeRequest('GET', endpoint);
  }

  async getProductsByCategory(category) {
    const endpoint = API_CONFIG.ENDPOINTS.PRODUCTS.BY_CATEGORY.replace('{category}', encodeURIComponent(category));
    const response = await this.apiHelper.makeRequest('GET', endpoint);
    return Array.isArray(response) ? response : response.data || response.products || [];
  }

  async searchProducts(searchTerm) {
    const endpoint = API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH.replace('{term}', encodeURIComponent(searchTerm));
    const response = await this.apiHelper.makeRequest('GET', endpoint);
    return Array.isArray(response) ? response : response.data || response.products || [];
  }

  async getCategoryProducts(categoryId) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.CATEGORIES.PRODUCTS.replace('{id}', categoryId);
      const response = await this.apiHelper.makeRequest('GET', endpoint);
      return Array.isArray(response) ? response : response.data || response.products || [];
    } catch (error) {
      const allProducts = await this.getAllProducts();
      return allProducts.filter(p => 
        p.category_id === categoryId || 
        p.category?.id === categoryId ||
        p.category_id?.toString() === categoryId.toString()
      );
    }
  }

  async getAllCategories() {
    const response = await this.apiHelper.makeRequest('GET', API_CONFIG.ENDPOINTS.CATEGORIES.LIST);
    return Array.isArray(response) ? response : response.data || response.categories || [];
  }
}
