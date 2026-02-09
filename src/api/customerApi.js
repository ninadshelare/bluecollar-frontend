import axiosInstance from "./axiosInstance";

export const getCustomerProfile = () =>
  axiosInstance.get("/api/customers/profile");

export const createCustomerProfile = (data) =>
  axiosInstance.post("/api/customers/profile", data, {
    headers: { "Content-Type": "application/json" },
  });

export const updateCustomerProfile = (data) =>
  axiosInstance.put("/api/customers/profile", data, {
    headers: { "Content-Type": "application/json" },
  });

export const deleteCustomerProfile = () =>
  axiosInstance.delete("/api/customers/profile");