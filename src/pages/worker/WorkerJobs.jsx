import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getWorkerJobs,
  acceptJob,
  completeJob,
} from "../../api/workRequestApi";

const WorkerJobs = () => {
  const workerId = localStorage.getItem("workerProfileId");

  const [jobs, setJobs] = useState([]);
  const [hoursWorked, setHoursWorked] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await getWorkerJobs(workerId);
      const jobList = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setJobs(jobList);
    } catch (err) {
      console.error("Failed to load jobs", err);
      alert("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!workerId) return;
    fetchJobs();
  }, [workerId]);

  const handleAccept = async (requestId) => {
    try {
      await acceptJob(requestId, workerId);
      fetchJobs();
    } catch {
      alert("Failed to accept job");
    }
  };

  const handleComplete = async (job) => {
    try {
      if (job.pricingType === "HOURLY") {
        const hours = Number(hoursWorked[job.requestId]);
        if (!hours || hours <= 0) {
          alert("Please enter valid hours worked");
          return;
        }
        await completeJob(job.requestId, hours);
      } else {
        await completeJob(job.requestId);
      }

      alert("Job completed & payment generated");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to complete job");
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.heading}>My Assigned Jobs</h1>

          {loading && <p style={styles.message}>Loading jobs...</p>}
          {!loading && jobs.length === 0 && (
            <p style={styles.message}>No jobs assigned yet</p>
          )}

          <div style={styles.grid}>
            {jobs.map((job) => (
              <div key={job.requestId} style={styles.card}>
                <div style={styles.topRow}>
                  <h3 style={styles.service}>{job.serviceName}</h3>
                  <span style={statusBadge(job.status)}>
                    {job.status}
                  </span>
                </div>

                <p style={styles.text}>
                  <strong>Customer:</strong> {job.customer?.name}
                </p>

                <p style={styles.text}>
                  <strong>Pricing:</strong> {job.pricingType}
                </p>

                {/* ================== ADDRESS & CONTACT (ONLY AFTER ACCEPT) ================== */}
                {job.status === "ACCEPTED" && job.customer && (
                  <div style={styles.addressBox}>
                    <p style={styles.text}>
                      <strong>📞 Contact:</strong> {job.customer.phone}
                    </p>

                    <p style={styles.text}>
                      <strong>📍 Address:</strong><br />
                      {job.customer.addressLine1}, {job.customer.addressLine2}<br />
                      {job.customer.city}, {job.customer.state} - {job.customer.pincode}
                    </p>
                  </div>
                )}

                {/* ================== ACTION BUTTONS ================== */}
                {job.status === "PENDING" && (
                  <button
                    onClick={() => handleAccept(job.requestId)}
                    style={styles.primaryBtn}
                  >
                    Accept Job
                  </button>
                )}

                {job.status === "ACCEPTED" && (
                  <div style={{ marginTop: 15 }}>
                    {job.pricingType === "HOURLY" && (
                      <input
                        type="number"
                        placeholder="Hours worked"
                        min="1"
                        value={hoursWorked[job.requestId] || ""}
                        onChange={(e) =>
                          setHoursWorked({
                            ...hoursWorked,
                            [job.requestId]: e.target.value,
                          })
                        }
                        style={styles.input}
                      />
                    )}

                    <button
                      onClick={() => handleComplete(job)}
                      style={styles.successBtn}
                    >
                      Complete Job
                    </button>
                  </div>
                )}

                {job.status === "COMPLETED" && (
                  <p style={styles.completed}>✔ Job Completed</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkerJobs;

/* ---------- STATUS BADGE ---------- */

const statusBadge = (status) => ({
  padding: "6px 14px",
  borderRadius: "30px",
  fontSize: 12,
  fontWeight: "600",
  letterSpacing: 0.4,
  color: "#fff",
  background:
    status === "PENDING"
      ? "#f59e0b"
      : status === "ACCEPTED"
      ? "#2563eb"
      : "#16a34a",
});

/* ---------- STYLES ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(120deg, #f0f4ff, #f8fafc)",
    padding: "50px 20px",
  },

  container: {
    maxWidth: 1100,
    margin: "auto",
  },

  heading: {
    color: "#1e293b",
    marginBottom: 35,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 28,
  },

  message: {
    textAlign: "center",
    color: "#64748b",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 24,
  },

  card: {
    background: "#ffffff",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  service: {
    margin: 0,
    fontWeight: "700",
    fontSize: 18,
    color: "#0f172a",
  },

  text: {
    margin: "8px 0",
    fontSize: 14,
    color: "#475569",
  },

  addressBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
  },

  primaryBtn: {
    marginTop: 18,
    background: "#2563eb",
    border: "none",
    padding: "10px 20px",
    borderRadius: 10,
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 14,
  },

  successBtn: {
    marginTop: 14,
    background: "#16a34a",
    border: "none",
    padding: "10px 20px",
    borderRadius: 10,
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 14,
  },

  completed: {
    marginTop: 14,
    color: "#16a34a",
    fontWeight: "600",
    fontSize: 14,
  },

  input: {
    padding: "9px 12px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    marginRight: 8,
    fontSize: 14,
  },

//commit
