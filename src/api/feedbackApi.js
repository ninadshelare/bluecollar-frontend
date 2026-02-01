import axios from "axios";

const BASE = "http://localhost:8081";

export const submitFeedback = ({ requestId, rating, comment }) =>
  axios.post(`${BASE}/api/feedback/add`, null, {
    params: {
      requestId,
      rating,
      comment,
    },
  });
