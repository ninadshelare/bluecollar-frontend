import { useState } from "react";
import Navbar from "../../components/Navbar";
import { updateWorkerProfile, deleteWorkerProfile } from "../../api/workerApi";
import { useNavigate } from "react-router-dom";

const WorkerProfile = () => {
  const navigate = useNavigate();
  const workerId = localStorage.getItem("workerProfileId"); 
  // ⚠️ This is NOT userId

  const [form, setForm] = useState({
    serviceName: "ELECTRICIAN",
    pricingType: "HOURLY",
    price: 300,
    experienceYears: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* -------- UPDATE PROFILE -------- */
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

  /* -------- DELETE PROFILE -------- */
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
      <div style={styles.container}>
        <h2>Edit Worker Profile</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleUpdate} style={styles.form}>
          {/* SERVICE */}
          <input
            name="serviceName"
            value={form.serviceName}
            onChange={handleChange}
            style={styles.input}
          />

          {/* EXPERIENCE */}
          <input
            type="number"
            name="experienceYears"
            value={form.experienceYears}
            onChange={handleChange}
            style={styles.input}
          />

          {/* PRICING TYPE */}
          <select
            name="pricingType"
            value={form.pricingType}
            onChange={handleChange}
            style={styles.input}
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
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.updateBtn}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <hr />

        <button onClick={handleDelete} style={styles.deleteBtn}>
          Delete Profile
        </button>
      </div>
    </>
  );
};

export default WorkerProfile;

/* ---------- STYLES ---------- */

const styles = {
  container: {
    maxWidth: 500,
    margin: "auto",
    padding: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: 10,
    marginBottom: 12,
  },
  updateBtn: {
    padding: 12,
    background: "#1976d2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  deleteBtn: {
    marginTop: 20,
    padding: 12,
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
};
