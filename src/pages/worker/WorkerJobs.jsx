
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getWorkerJobs,
  acceptJob,
  completeJob,
} from "../../api/workRequestApi";
import { getWorkerProfileByUser } from "../../api/workerApi";

const WorkerJobs = () => {
  const userId = Number(localStorage.getItem("userId"));

  const [workerId, setWorkerId] = useState(
    Number(localStorage.getItem("workerProfileId"))
  );

  const [jobs, setJobs] = useState([]);
  const [hoursWorked, setHoursWorked] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= RESTORE workerProfileId ================= */
  useEffect(() => {
    const restoreWorkerProfile = async () => {
      if (workerId && !isNaN(workerId)) return;

      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await getWorkerProfileByUser(userId);
        localStorage.setItem("workerProfileId", res.data.workerId);
        setWorkerId(res.data.workerId);
      } catch (err) {
        console.error(err);
        setError("Worker profile not found");
        setLoading(false);
      }
    };

    restoreWorkerProfile();
  }, [workerId, userId]);
  /* =========================================================== */

  const fetchJobs = async () => {
    if (!workerId || isNaN(workerId)) return;

    try {
      setLoading(true);
      const res = await getWorkerJobs(workerId);
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workerId && !isNaN(workerId)) {
      fetchJobs();
    }
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
      const pricingType = job.pricing?.[0]?.pricingType;

      if (pricingType === "HOURLY") {
        const hours = Number(hoursWorked[job.requestId]);
        if (!hours || hours <= 0) {
          alert("Enter valid hours worked");
          return;
        }
        await completeJob(job.requestId, hours);
      } else {
        await completeJob(job.requestId);
      }

      alert("Job completed");
      fetchJobs();
    } catch {
      alert("Failed to complete job");
    }
  };

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: 80 }}>
          Loading jobs…
        </p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: 80, color: "red" }}>
          {error}
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.heading}>My Assigned Jobs</h1>

          {jobs.length === 0 && (
            <p style={styles.message}>No jobs assigned yet</p>
          )}

          <div style={styles.grid}>
            {jobs.map((job) => {
              const pricingType = job.pricing?.[0]?.pricingType;

              return (
                <div key={job.requestId} style={styles.card}>
                  <div style={styles.topRow}>
                    <h3 style={styles.service}>{job.serviceName}</h3>
                    <span style={statusBadge(job.status)}>
                      {job.status}
                    </span>
                  </div>

                  <p style={styles.text}>
                    <strong>Customer:</strong>{" "}
                    {job.customer?.name || "Unknown"}
                  </p>

                  <p style={styles.text}>
                    <strong>Pricing:</strong>{" "}
                    {pricingType || "N/A"}
                  </p>

                  {job.status === "ACCEPTED" && job.customer && (
                    <div style={styles.addressBox}>
                      <p style={styles.text}>
                        <strong>📞 Contact:</strong>{" "}
                        {job.customer.phone || "Not provided"}
                      </p>
                      <p style={styles.text}>
                        <strong>📍 Address:</strong><br />
                        {job.customer.addressLine1 || "-"}{" "}
                        {job.customer.addressLine2 || ""}<br />
                        {job.customer.city || "-"},{" "}
                        {job.customer.state || "-"}{" "}
                        {job.customer.pincode || ""}
                      </p>
                    </div>
                  )}

                  {job.status === "PENDING" && (
                    <button
                      onClick={() => handleAccept(job.requestId)}
                      style={styles.primaryBtn}
                    >
                      Accept Job
                    </button>
                  )}

                  {job.status === "ACCEPTED" && (
                    <>
                      {pricingType === "HOURLY" && (
                        <input
                          type="number"
                          placeholder="Hours worked"
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
                    </>
                  )}

                  {job.status === "COMPLETED" && (
                    <p style={styles.completed}>✔ Job Completed</p>
                  )}
                </div>
              );
            })}
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
};
