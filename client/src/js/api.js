// /src/js/api.js
// Complete API client for MealMemo

import { getToken } from "./auth.js";

const API_BASE = "/api";

// ========== Generic Request Function ==========

async function request(endpoint, options = {}) {
  const token = getToken();
  console.log("Token being sent:", token ? "Yes" : "No"); // Add this line

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// ========== Auth Endpoints ==========

export const auth = {
  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => request("/auth/me"),
};

// ========== Recipe Endpoints ==========

export const recipes = {
  getAll: (search = "") =>
    request(`/recipes${search ? `?search=${encodeURIComponent(search)}` : ""}`),

  getById: (id) => request(`/recipes/${id}`),

  create: (recipeData) =>
    request("/recipes", {
      method: "POST",
      body: JSON.stringify(recipeData),
    }),

  update: (id, recipeData) =>
    request(`/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(recipeData),
    }),

  delete: (id) =>
    request(`/recipes/${id}`, {
      method: "DELETE",
    }),

  submit: (id) =>
    request(`/recipes/${id}/submit`, {
      method: "POST",
    }),
};

// ========== Featured Endpoints ==========

export const featured = {
  getAll: (search = "") =>
    request(
      `/featured${search ? `?search=${encodeURIComponent(search)}` : ""}`,
    ),

  getById: (id) => request(`/featured/${id}`),

  copy: (id) =>
    request(`/featured/${id}/copy`, {
      method: "POST",
    }),

  unfeature: (id) =>
    request(`/featured/${id}/unfeature`, {
      method: "POST",
    }),

  delete: (id) =>
    request(`/featured/${id}`, {
      method: "DELETE",
    }),
};

// ========== Submission Endpoints ==========

export const submissions = {
  getAll: () => request("/submissions"),

  getById: (id) => request(`/submissions/${id}`),

  approve: (id, notes) =>
    request(`/submissions/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    }),

  reject: (id, notes) =>
    request(`/submissions/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    }),
};

// ========== Category Endpoints ==========

export const categories = {
  getAll: (includeCount = false) =>
    request(`/categories${includeCount ? "?includeCount=true" : ""}`),

  getById: (id) => request(`/categories/${id}`),

  create: (categoryData) =>
    request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }),

  update: (id, categoryData) =>
    request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    }),

  delete: (id) =>
    request(`/categories/${id}`, {
      method: "DELETE",
    }),
};

// ========== Admin Endpoints ==========

export const admin = {
  getAllUsers: () => request("/admin/users"),

  searchUser: (email) =>
    request(`/admin/users/search?email=${encodeURIComponent(email)}`),

  updateUserRole: (userId, role) =>
    request(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    }),
};
