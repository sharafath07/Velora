// import { Client, Account, Databases } from "appwrite";

// const client = new Client();

// client
//     .setEndpoint("https://nyc.cloud.appwrite.io/v1")
//     .setProject("68dbf06b003c3626d20b");

// const account = new Account(client);
// const databases = new Databases(client);

// export { client, account, databases };

import axios from 'axios';

// Base URL for your backend API
const BASE_URL = import.meta.env.API_URL || 'https://velora-dm0l.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error codes
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ### Authentication (`/api/auth`)
// - `POST /register` - Register user
// - `POST /login` - Login user
// - `GET /profile` - Get profile (Protected)
// - `PUT /profile` - Update profile (Protected)
// - `PUT /change-password` - Change password (Protected)
// - `GET /users` - Get all users (Admin)
// - `GET /users/:id` - Get user by ID (Admin)
// - `PUT /users/:id` - Update user (Admin)
// - `DELETE /users/:id` - Delete user (Admin)

// ### Categories (`/api/categories`)
// - `GET /` - Get all categories
// - `GET /:id` - Get category by ID
// - `POST /` - Create category (Admin)
// - `PUT /:id` - Update category (Admin)
// - `DELETE /:id` - Delete category (Admin)

// ### Products (`/api/products`)
// - `GET /` - Get all products (with filters)
// - `GET /featured` - Get featured products
// - `GET /category/:categoryId` - Get products by category
// - `GET /:id` - Get product by ID
// - `POST /` - Create product (Admin)
// - `PUT /:id` - Update product (Admin)
// - `PATCH /:id/stock` - Update stock (Admin)
// - `DELETE /:id` - Delete product (Admin)

// ### Orders (`/api/orders`)
// - `POST /` - Create order (Protected)
// - `GET /myorders` - Get user orders (Protected)
// - `GET /:id` - Get order by ID (Protected)
// - `PUT /:id/cancel` - Cancel order (Protected)
// - `GET /` - Get all orders (Admin)
// - `GET /stats/dashboard` - Get statistics (Admin)
// - `PUT /:id/status` - Update order status (Admin)
// - `DELETE /:id` - Delete order (Admin)

// ---