import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { updateWorkerProfile, deleteWorkerProfile } from "../../api/workerApi";
import { useNavigate } from "react-router-dom";

const WorkerProfile = () => {
  const navigate = useNavigate();
  const workerId = localStorage.getItem("workerProfileId");

  const [form, setForm] = useState({
    serviceName: "ELECTRICIAN",
    pricingType: "HOURLY",
    price: 300,
    experienceYears: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      await updateWorkerProfile(workerId, {
        serviceName: form.serviceName,
        pricingType: form.pricingType,
        price: Number(form.price),
        experienceYears: Number(form.experienceYears),
      });

      alert("Profile updated successfully");
      navigate("/worker");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your worker profile?"
    );

    if (!confirmDelete) return;

    try {
      await deleteWorkerProfile(workerId);
      alert("Profile deleted successfully");
      localStorage.removeItem("workerProfileId");
      navigate("/worker");
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          ...styles.page,
          background: darkMode
            ? "linear-gradient(135deg,#1a1a1a,#121212)"
            : "linear-gradient(135deg,#e3f2fd,#fce4ec)",
        }}
      >
        <div
          style={{
            ...styles.card,
            background: darkMode ? "#1e1e1e" : "#ffffff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <h2 style={styles.heading}>Edit Worker Profile</h2>

          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleUpdate} style={styles.form}>
            {/* SERVICE */}
            <input
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              style={{
                ...styles.input,
                background: darkMode ? "#2a2a2a" : "#f9f9f9",
                color: darkMode ? "#fff" : "#000",
                border: darkMode
                  ? "1px solid #444"
                  : "1px solid #ddd",
              }}
            />

            {/* EXPERIENCE */}
            <input
              type="number"
              name="experienceYears"
              value={form.experienceYears}
              onChange={handleChange}
              style={{
                ...styles.input,
                background: darkMode ? "#2a2a2a" : "#f9f9f9",
                color: darkMode ? "#fff" : "#000",
                border: darkMode
                  ? "1px solid #444"
                  : "1px solid #ddd",
              }}
            />

            {/* PRICING TYPE DROPDOWN (Improved) */}
            <select
              name="pricingType"
              value={form.pricingType}
              onChange={handleChange}
              style={{
                ...styles.input,
                background: darkMode ? "#2a2a2a" : "#f9f9f9",
                color: darkMode ? "#fff" : "#000",
                border: darkMode
                  ? "1px solid #444"
                  : "1px solid #ddd",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                cursor: "pointer",
              }}
            >
              <option value="HOURLY">Hourly</option>
              <option value="FIXED">Fixed</option>
            </select>

            {/* PRICE */}
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              style={{
                ...styles.input,
                background: darkMode ? "#2a2a2a" : "#f9f9f9",
                color: darkMode ? "#fff" : "#000",
                border: darkMode
                  ? "1px solid #444"
                  : "1px solid #ddd",
              }}
            />

            <button type="submit" disabled={loading} style={styles.updateBtn}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          <button onClick={handleDelete} style={styles.deleteBtn}>
            Delete Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkerProfile;

/* ---------- STYLES ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "80px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    padding: "50px",
    borderRadius: "30px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },

  heading: {
    fontSize: "26px",
    marginBottom: "30px",
    textAlign: "center",
    fontWeight: "600",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  input: {
    padding: "18px",
    borderRadius: "20px",
    fontSize: "14px",
    outline: "none",
  },

  updateBtn: {
    padding: "18px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg,#7b1fa2,#42a5f5)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  deleteBtn: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "25px",
    border: "none",
    background: "#ef5350",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
  },

  error: {
    color: "#ff5252",
    marginBottom: "15px",
    textAlign: "center",
  },
};
