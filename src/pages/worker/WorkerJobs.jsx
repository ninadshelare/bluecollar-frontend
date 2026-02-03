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

  /* -------- FETCH JOBS -------- */
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
    if (!workerId) {
      console.error("Worker profile ID missing");
      return;
    }
    fetchJobs();
  }, [workerId]);

  /* -------- ACCEPT JOB -------- */
  const handleAccept = async (requestId) => {
    try {
      await acceptJob(requestId, workerId);
      fetchJobs();
    } catch {
      alert("Failed to accept job");
    }
  };

  /* -------- COMPLETE JOB -------- */
  const handleComplete = async (job) => {
    try {
      // ✅ Only HOURLY jobs need hoursWorked
      if (job.pricingType === "HOURLY") {
        const hours = Number(hoursWorked[job.requestId]);
        if (!hours || hours <= 0) {
          alert("Please enter valid hours worked");
          return;
        }
        await completeJob(job.requestId, hours);
      } else {
        // ✅ PER_JOB / MONTHLY → NO hoursWorked
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
      <div style={styles.container}>
        <h2>My Jobs</h2>

        {loading && <p>Loading...</p>}
        {!loading && jobs.length === 0 && <p>No jobs assigned</p>}

        {jobs.map((job) => (
          <div key={job.requestId} style={styles.card}>
            <p><b>Service:</b> {job.serviceName}</p>

            <p>
              <b>Status:</b>
              <span style={statusStyle(job.status)}>{job.status}</span>
            </p>

            <p><b>Customer:</b> {job.customer?.name}</p>

            <p>
              <b>Pricing:</b>{" "}
              <span style={{ fontWeight: "bold" }}>
                {job.pricingType}
              </span>
            </p>

            {/* PENDING → ACCEPT */}
            {job.status === "PENDING" && (
              <button
                onClick={() => handleAccept(job.requestId)}
                style={styles.acceptBtn}
              >
                Accept Job
              </button>
            )}

            {/* ACCEPTED → COMPLETE */}
            {job.status === "ACCEPTED" && (
              <div style={{ marginTop: 10 }}>
                {/* ✅ HOURS INPUT ONLY FOR HOURLY */}
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
                  style={styles.completeBtn}
                >
                  Complete Job
                </button>
              </div>
            )}

            {/* COMPLETED */}
            {job.status === "COMPLETED" && (
              <p style={styles.completedText}>✔ Job Completed</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default WorkerJobs;

/* ---------- STYLES ---------- */

const statusStyle = (status) => ({
  marginLeft: 6,
  fontWeight: "bold",
  color:
    status === "PENDING"
      ? "#f57c00"
      : status === "ACCEPTED"
      ? "#1976d2"
      : "#2e7d32",
});

const styles = {
  container: {
    padding: 20,
    maxWidth: 700,
    margin: "auto",
  },
  card: {
    border: "1px solid #ddd",
    padding: 16,
    marginTop: 12,
    borderRadius: 8,
    background: "#fafafa",
  },
  acceptBtn: {
    marginTop: 8,
    background: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: 5,
  },
  completeBtn: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: 5,
    marginLeft: 6,
  },
  completedText: {
    color: "#2e7d32",
    fontWeight: "bold",
    marginTop: 8,
  },
  input: {
    padding: 6,
    width: 130,
    marginRight: 6,
  },
};
