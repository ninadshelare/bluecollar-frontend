import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const WorkerProfileSetup = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const workerProfileId = localStorage.getItem("workerProfileId");

  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceName: "",
    pricingType: "HOURLY",
    price: "",
    experienceYears: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------- FETCH SERVICES ONLY (NO REDIRECTS) -------- */
  useEffect(() => {
    axiosInstance
      .get("/api/services")
      .then((res) => setServices(res.data))
      .catch(() => setError("Failed to load services"));
  }, []);

  /* -------- HANDLE INPUT -------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* -------- SUBMIT (CREATE OR UPDATE) -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.serviceName || !form.price || !form.experienceYears) {
      setError("All fields are required");
      return;
    }

    const payload = {
      serviceName: form.serviceName,
      pricingType: form.pricingType,
      price: Number(form.price),
      experienceYears: Number(form.experienceYears),
    };

    setLoading(true);
    try {
      if (workerProfileId) {
        // UPDATE
        await axiosInstance.put(
          `/api/workers/profile/${workerProfileId}`,
          payload
        );
        alert("Profile updated successfully");
      } else {
        // CREATE
        const res = await axiosInstance.post(
          "/api/workers/profile",
          payload,
          { params: { userId } }
        );

        localStorage.setItem("workerProfileId", res.data.workerId);
        alert("Profile created successfully");
      }

      navigate("/worker");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>{workerProfileId ? "Update Profile" : "Complete Profile"}</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* SERVICE */}
          <select
            name="serviceName"
            value={form.serviceName}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {/* EXPERIENCE */}
          <input
            type="number"
            name="experienceYears"
            placeholder="Experience (years)"
            value={form.experienceYears}
            onChange={handleChange}
            min="0"
            required
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
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            min="1"
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading
              ? "Saving..."
              : workerProfileId
                ? "Update Profile"
                : "Save Profile"}
          </button>
        </form>
      </div>
    </>
  );
};

export default WorkerProfileSetup;

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
  button: {
    padding: 12,
    background: "#1976d2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
};
