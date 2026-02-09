import axiosInstance from "./axiosInstance";

/* ---------------- FEEDBACK (JWT BASED) ---------------- */

export const submitFeedback = ({ requestId, rating, comment }) =>
  axiosInstance.post(`/api/feedback/add`, null, {
    params: {
      requestId,
      rating,
      comment,
    },
  });