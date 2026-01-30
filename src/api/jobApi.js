import axiosInstance from "./axiosInstance";


// Fetch all service categories
export const getServices = () => {
  return axiosInstance.get("/api/services");
};

// Search workers with filters
export const searchWorkers = (params) => {
  return axiosInstance.get("/api/workers/search", { params });
};

// Get single worker profile (optional)
export const getWorkerProfile = (workerId) => {
  return axiosInstance.get(`/api/workers/${workerId}`);
};




