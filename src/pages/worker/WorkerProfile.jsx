import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  updateWorkerProfile,
  deleteWorkerProfile,
  getWorkerProfileByUser,
} from "../../api/workerApi";
import { useNavigate } from "react-router-dom";

const WorkerProfile = () => {
  const navigate = useNavigate();

  const userId = Number(localStorage.getItem("userId")); // 🔥 REQUIRED
  const [workerId, setWorkerId] = useState(
    Number(localStorage.getItem("workerProfileId"))
  );

  const [form, setForm] = useState({
    serviceName: "ELECTRICIAN",
    pricingType: "PER_JOB",
    price: 300,
    experienceYears: 5,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* ================= THE FIX ================= */
  useEffect(() => {
    const restoreProfile = async () => {
      if (workerId) {
        setLoading(false);
        return;
      }

      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await getWorkerProfileByUser(userId);

        localStorage.setItem("workerProfileId", res.data.workerId);
        setWorkerId(res.data.workerId);

        setForm({
          serviceName: res.data.service,
          pricingType: res.data.pricing[0]?.pricingType,
          price: res.data.pricing[0]?.price,
          experienceYears: res.data.experienceYears,
        });
      } catch (err) {
        setError("Worker profile not found");
      } finally {
        setLoading(false);
      }
    };

    restoreProfile();
  }, [workerId, userId]);

  /* ========================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!workerId) {
      setError("Worker profile not loaded");
      return;
    }

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
    }
  };

  const handleDelete = async () => {
    if (!workerId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your worker profile?"
    );
    if (!confirmDelete) return;

    try {
      await deleteWorkerProfile(workerId);
      localStorage.removeItem("workerProfileId");
      alert("Profile deleted");
      navigate("/worker");
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: 100 }}>Loading profile...</p>
      </>
    );
  }

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
            <input name="serviceName" value={form.serviceName} onChange={handleChange} style={styles.input} />
            <input type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} style={styles.input} />

            <select name="pricingType" value={form.pricingType} onChange={handleChange} style={styles.input}>
              <option value="PER_JOB">Fixed</option>
              <option value="HOURLY">Hourly</option>
            </select>

            <input type="number" name="price" value={form.price} onChange={handleChange} style={styles.input} />

            <button type="submit" style={styles.updateBtn}>
              Update Profile
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
