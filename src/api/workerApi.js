import axiosInstance from "./axiosInstance";

/* UPDATE worker profile */
export const updateWorkerProfile = (workerId, payload) => {
  return axiosInstance.put(
    `/api/workers/profile/${workerId}`,
    payload
  );
};

/* DELETE worker profile */
export const deleteWorkerProfile = (workerId) => {
  return axiosInstance.delete(
    `/api/workers/profile/${workerId}`
  );
};
