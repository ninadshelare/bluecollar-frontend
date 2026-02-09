import axios from "axios";
import axiosInstance from "./axiosInstance";

const BASE = "http://localhost:8081";

/* -------- PUBLIC -------- */
export const searchWorkers = (params) =>
  axios.get(`${BASE}/api/workers/search`, { params });

/* -------- JWT PROTECTED -------- */

// CUSTOMER
export const createWorkRequest = (workerId) =>
  axiosInstance.post(`/api/work-requests/create`, null, {
    params: { workerId },
  });

export const getCustomerRequests = () =>
  axiosInstance.get(`/api/work-requests/customer`);

// WORKER
export const getWorkerJobs = (workerId) =>
  axiosInstance.get(`/api/work-requests/worker/${workerId}`);

export const acceptJob = (requestId, workerId) =>
  axiosInstance.post(`/api/work-requests/accept`, null, {
    params: { requestId, workerId },
  });

export const completeJob = (requestId, hoursWorked) =>
  axiosInstance.post(`/api/work-requests/complete`, null, {
    params: { requestId, hoursWorked },
  });