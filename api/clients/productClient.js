import { ApiHelper } from '../utils/apiHelper.js';
import { API_CONFIG } from '../../config/api.config.js';

export class ProductClient {
  constructor(request) {
    this.apiHelper = new ApiHelper(request);
  }

  _normalizeArrayResponse(response) {
    return Array.isArray(response) ? response : response.data || response.products || [];
  }

  async getAllProducts() {
    const response = await this.apiHelper.makeRequest('GET', API_CONFIG.ENDPOINTS.PRODUCTS.LIST);
    return this._normalizeArrayResponse(response);
  }

  async getProductById(id) {
    const endpoint = API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID.replace('{id}', id);
    return await this.apiHelper.makeRequest('GET', endpoint);
  }

  async getProductsByCategory(category) {
    const endpoint = API_CONFIG.ENDPOINTS.PRODUCTS.BY_CATEGORY.replace('{category}', encodeURIComponent(category));
    const response = await this.apiHelper.makeRequest('GET', endpoint);
    return this._normalizeArrayResponse(response);
  }

  async searchProducts(searchTerm) {
    const endpoint = API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH.replace('{term}', encodeURIComponent(searchTerm));
    const response = await this.apiHelper.makeRequest('GET', endpoint);
    return this._normalizeArrayResponse(response);
  }

  async getCategoryProducts(categoryId) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.CATEGORIES.PRODUCTS.replace('{id}', categoryId);
      const response = await this.apiHelper.makeRequest('GET', endpoint);
      return this._normalizeArrayResponse(response);
    } catch (error) {
      const allProducts = await this.getAllProducts();
      const categoryIdStr = categoryId.toString();
      return allProducts.filter(p => 
        p.category_id?.toString() === categoryIdStr || 
        p.category?.id?.toString() === categoryIdStr
      );
    }
  }

  async getAllCategories() {
    const response = await this.apiHelper.makeRequest('GET', API_CONFIG.ENDPOINTS.CATEGORIES.LIST);
    return Array.isArray(response) ? response : response.data || response.categories || [];
  }
}
