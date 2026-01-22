import { API_CONFIG } from '../../config/api.config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ApiHelper {
  constructor(request) {
    this.request = request;
    this.baseURL = API_CONFIG.BASE_URL;
    this.messagesDir = path.join(process.cwd(), 'messages', 'api-responses');
    this.ensureMessagesDirectory();
  }

  ensureMessagesDirectory() {
    if (!fs.existsSync(this.messagesDir)) {
      fs.mkdirSync(this.messagesDir, { recursive: true });
    }
  }

  async makeRequest(method, endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    if (options.data) {
      config.data = options.data;
    }

    try {
      const response = await this.request.fetch(url, config);
      const responseData = await response.json();
      
      // Save API response to messages directory
      this.saveApiResponse(endpoint, method, responseData, response.status());
      
      if (!response.ok()) {
        throw new Error(`API Error: ${response.status()} - ${JSON.stringify(responseData)}`);
      }
      
      return responseData;
    } catch (error) {
      this.saveApiError(endpoint, method, error);
      throw error;
    }
  }

  saveApiResponse(endpoint, method, data, status) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeEndpoint = endpoint.replace(/\//g, '_').replace(/[{}]/g, '');
    const filename = `${method}_${safeEndpoint}_${timestamp}.json`;
    const filepath = path.join(this.messagesDir, filename);
    
    const responseData = {
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      status,
      data
    };
    
    fs.writeFileSync(filepath, JSON.stringify(responseData, null, 2));
  }

  saveApiError(endpoint, method, error) {
    const errorDir = path.join(process.cwd(), 'messages', 'error-messages');
    if (!fs.existsSync(errorDir)) {
      fs.mkdirSync(errorDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeEndpoint = endpoint.replace(/\//g, '_').replace(/[{}]/g, '');
    const filename = `ERROR_${method}_${safeEndpoint}_${timestamp}.json`;
    const filepath = path.join(errorDir, filename);
    
    const errorData = {
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      error: error.message,
      stack: error.stack
    };
    
    fs.writeFileSync(filepath, JSON.stringify(errorData, null, 2));
  }

  async retryRequest(method, endpoint, options = {}, maxRetries = API_CONFIG.RETRIES) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.makeRequest(method, endpoint, options);
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    throw lastError;
  }
}
