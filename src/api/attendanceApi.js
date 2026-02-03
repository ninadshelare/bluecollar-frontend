import axios from "axios";
const BASE = "http://localhost:8081";

export const checkIn = (workerId, workDate) =>
  axios.post(`${BASE}/api/attendance/check-in`, null, {
    params: { workerId, workDate },
  });

export const checkOut = (workerId, workDate) =>
  axios.post(`${BASE}/api/attendance/check-out`, null, {
    params: { workerId, workDate },
  });

export const getMaidSummary = (workerId, month, year) =>
  axios.get(`${BASE}/api/attendance/maid/${workerId}/summary`, {
    params: { month, year },
  });
