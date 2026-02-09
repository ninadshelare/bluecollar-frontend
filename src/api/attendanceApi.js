import axiosInstance from "./axiosInstance";

/* ---------------- ATTENDANCE (JWT PROTECTED) ---------------- */

export const checkIn = (workerId, workDate) =>
  axiosInstance.post(`/api/attendance/check-in`, null, {
    params: { workerId, workDate },
  });

export const checkOut = (workerId, workDate) =>
  axiosInstance.post(`/api/attendance/check-out`, null, {
    params: { workerId, workDate },
  });

export const getMaidSummary = (workerId, month, year) =>
  axiosInstance.get(`/api/attendance/maid/${workerId}/summary`, {
    params: { month, year },
  });