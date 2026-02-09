import axios from "axios";

const BASE = "http://localhost:8081";

/* Get payment by work request */
export const getPaymentByRequest = (workRequestId) =>
  axios.get(`${BASE}/api/payments/by-request/${workRequestId}`);

/* STEP 1: Initiate payment (send OTP) */
export const initiatePayment = (paymentId) =>
  axios.post(`${BASE}/api/payments/${paymentId}/initiate`);

/* STEP 2: Verify OTP and complete payment */
export const verifyOtpPayment = (paymentId, data) =>
  axios.post(`${BASE}/api/payments/${paymentId}/verify-otp`, data);
