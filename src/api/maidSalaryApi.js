import axios from "axios";
const BASE = "http://localhost:8081";

export const generateSalary = (workerId, month, year) =>
  axios.post(`${BASE}/api/maid-salary/generate`, null, {
    params: { workerId, month, year },
  });

export const paySalary = (salaryId) =>
  axios.put(`${BASE}/api/maid-salary/${salaryId}/pay`);
