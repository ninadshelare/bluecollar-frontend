import { useState } from "react";
import Navbar from "../../components/Navbar";
import { getMaidSummary } from "../../api/attendanceApi";
import { generateSalary, paySalary } from "../../api/maidSalaryApi";

const MaidSalary = () => {
  const workerId = localStorage.getItem("workerProfileId");

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [salary, setSalary] = useState(null);

  const handleGenerate = async () => {
    const summary = await getMaidSummary(workerId, month, year);
    const res = await generateSalary(workerId, month, year);
    setSalary(res.data);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>Monthly Salary</h2>

        <input placeholder="MM" onChange={(e) => setMonth(e.target.value)} />
        <input placeholder="YYYY" onChange={(e) => setYear(e.target.value)} />

        <button onClick={handleGenerate}>Generate Salary</button>

        {salary && (
          <>
            <p>Amount: ₹{salary.amount}</p>
            <p>Status: {salary.status}</p>

            {salary.status === "PENDING" && (
              <button onClick={() => paySalary(salary.salaryId)}>
                Pay Salary
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MaidSalary;
