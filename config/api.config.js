export const API_CONFIG = {
  BASE_URL: 'https://api.practicesoftwaretesting.com',
  TIMEOUT: 30000,
  RETRIES: 3,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/users/login',
      REGISTER: '/users/register',
      LOGOUT: '/users/logout'
    },
    PRODUCTS: {
      LIST: '/products',
      BY_ID: '/products/{id}',
      BY_CATEGORY: '/products?category={category}',
      SEARCH: '/products?search={term}'
    },
    CATEGORIES: {
      LIST: '/categories',
      PRODUCTS: '/categories/{id}/products'
    },
    CART: {
      GET: '/carts',
      ADD_ITEM: '/carts/items',
      UPDATE_ITEM: '/carts/items/{id}',
      DELETE_ITEM: '/carts/items/{id}',
      CLEAR: '/carts/clear'
    },
    ORDERS: {
      LIST: '/invoices',
      BY_ID: '/invoices/{id}',
      CREATE: '/payment'
    },
    USERS: {
      PROFILE: '/users/me',
      ADDRESS: '/users/me/address',
      UPDATE_ADDRESS: '/users/me/address'
    }
  }
};
