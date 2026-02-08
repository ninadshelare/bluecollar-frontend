import axiosInstance from "./axiosInstance";

/* ---------- UPDATE worker profile ---------- */
export const updateWorkerProfile = (workerId, payload) => {
  return axiosInstance.put(
    `/api/workers/profile/${workerId}`,
    payload
  );
};

/* ---------- DELETE worker profile ---------- */
export const deleteWorkerProfile = (workerId) => {
  return axiosInstance.delete(
    `/api/workers/profile/${workerId}`
  );
};

/* ---------- GET worker earnings ---------- */
export const getWorkerEarnings = (workerId) => {
  return axiosInstance.get(
    `/api/workers/${workerId}/earnings`
  );
};

/* ---------- 🔥 ADD THIS (DO NOT REMOVE OTHERS) ---------- */
export const getWorkerProfileByUser = (userId) => {
  return axiosInstance.get(
    `/api/workers/profile/by-user/${userId}`
  );
};
