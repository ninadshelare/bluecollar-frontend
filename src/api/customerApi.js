import axios from "axios";

const BASE = "http://localhost:8081";

// View profile
export const getCustomerProfile = (userId) =>
  axios.get(`${BASE}/api/customers/profile`, {
    params: { userId },
  });

// Create profile
export const createCustomerProfile = (userId, data) =>
  axios.post(`${BASE}/api/customers/profile`, data, {
    params: { userId },
  });

// Update profile
export const updateCustomerProfile = (userId, data) =>
  axios.put(`${BASE}/api/customers/profile`, data, {
    params: { userId },
  });

// Delete profile
export const deleteCustomerProfile = (userId) =>
  axios.delete(`${BASE}/api/customers/profile`, {
    params: { userId },
  });
