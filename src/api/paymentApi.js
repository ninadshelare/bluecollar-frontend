import axios from "axios";

const BASE = "http://localhost:8081";

/* Get payment by work request */
export const getPaymentByRequest = (workRequestId) =>
  axios.get(`${BASE}/api/payments/by-request/${workRequestId}`);

/* Pay Now (no gateway) */
export const payNow = (paymentId) =>
  axios.put(`${BASE}/api/payments/${paymentId}/pay`);
