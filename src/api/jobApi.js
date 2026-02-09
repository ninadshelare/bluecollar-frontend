import axios from "axios";

const BASE = "http://localhost:8081";

// Fetch all service categories
export const getServices = () =>
  axios.get(`${BASE}/api/services`);

// Search workers with filters
export const searchWorkers = (params) =>
  axios.get(`${BASE}/api/workers/search`, { params });

// Get single worker profile (public)
export const getWorkerProfile = (workerId) =>
  axios.get(`${BASE}/api/workers/${workerId}`);