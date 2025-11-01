import api from './axios';

const productService = {
  // Get all products with filters
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get featured products
  getFeatured: async (limit = 8) => {
    try {
      const response = await api.get('/products/featured', { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single product
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get products by category
  getByCategory: async (categoryId, params = {}) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create product (Admin only)
  create: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update product (Admin only)
  update: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update stock (Admin only)
  updateStock: async (id, stock) => {
    try {
      const response = await api.patch(`/products/${id}/stock`, { stock });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete product (Admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default productService;