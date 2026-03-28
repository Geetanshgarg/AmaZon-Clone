const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { credentials: "include" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (endpoint: string, body: any) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  put: async (endpoint: string, body: any) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  delete: async (endpoint: string) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: "DELETE", credentials: "include" });
    if (res.status !== 204 && !res.ok) throw new Error(await res.text());
    // if 204 no content, don't try to parse JSON
    return res.status === 204 ? true : res.json();
  },
};

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const ProductService = {
  getProducts: (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.categoryId) params.append("categoryId", filters.categoryId);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    return api.get(`/products?${params.toString()}`);
  },
  getCategories: () => api.get("/products/categories"),
  getProductById: (id: string) => api.get(`/products/${id}`),
};

export const CartService = {
  getCart: () => api.get("/cart"),
  addToCart: (productId: string, quantity: number) => api.post("/cart", { productId, quantity }),
  updateCartItem: (id: string, quantity: number) => api.put(`/cart/${id}`, { quantity }),
  removeFromCart: (id: string) => api.delete(`/cart/${id}`),
};

export const OrderService = {
  getOrders: () => api.get("/orders"),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
  createOrder: (payload?: any) => api.post("/orders", payload || {}),
};
