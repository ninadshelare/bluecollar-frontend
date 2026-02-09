import axiosInstance from "./axiosInstance";

/* ---------------- PAYMENTS (JWT BASED) ---------------- */

/* Get payment by work request */
export const getPaymentByRequest = (workRequestId) =>
  axiosInstance.get(`/api/payments/by-request/${workRequestId}`);

/* STEP 1: Initiate payment (send OTP) */
export const initiatePayment = (paymentId) =>
  axiosInstance.post(`/api/payments/${paymentId}/initiate`);

/* STEP 2: Verify OTP and complete payment */
export const verifyOtpPayment = (paymentId, data) =>
  axiosInstance.post(`/api/payments/${paymentId}/verify-otp`, data);