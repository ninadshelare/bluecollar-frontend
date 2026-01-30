import axios from "axios";

const BASE = "http://localhost:8081";

export const searchWorkers = (params) =>
  axios.get(`${BASE}/api/workers/search`, { params });

export const createWorkRequest = (customerId, workerId) =>
  axios.post(`${BASE}/api/work-requests/create`, null, {
    params: { customerId, workerId },
  });

export const getWorkerJobs = (workerId) =>
  axios.get(`${BASE}/api/work-requests/worker/${workerId}`);

export const acceptJob = (requestId, workerId) =>
  axios.post(`${BASE}/api/work-requests/accept`, null, {
    params: { requestId, workerId },
  });

export const completeJob = (requestId, hoursWorked) =>
  axios.post(`${BASE}/api/work-requests/complete`, null, {
    params: { requestId, hoursWorked },
  });