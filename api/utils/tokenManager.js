export class TokenManager {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
  }

  setToken(token, expiresIn = 3600) {
    this.token = token;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
  }

  getToken() {
    if (this.isTokenValid()) {
      return this.token;
    }
    return null;
  }

  isTokenValid() {
    return this.token && this.tokenExpiry && Date.now() < this.tokenExpiry;
  }

  clearToken() {
    this.token = null;
    this.tokenExpiry = null;
  }

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
