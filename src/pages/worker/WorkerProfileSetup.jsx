import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const SERVICE_MAP = {
  ELECTRICIAN: { workerType: "SKILLED", pricingType: "PER_JOB" },
  PLUMBER: { workerType: "SKILLED", pricingType: "PER_JOB" },
  PAINTER: { workerType: "SKILLED", pricingType: "PER_JOB" },
  CARPENTER: { workerType: "SKILLED", pricingType: "PER_JOB" },
  LABOUR: { workerType: "LABOUR", pricingType: "HOURLY" },
  MAID: { workerType: "MAID", pricingType: "MONTHLY" },
};


const WorkerProfileSetup = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const workerProfileId = localStorage.getItem("workerProfileId");

  const [form, setForm] = useState({
  serviceName: "",
  workerType: "",
  pricingType: "",
  price: "",
  experienceYears: "",
});


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------- HANDLE SERVICE CHANGE -------- */
  const handleServiceChange = (e) => {
  const service = e.target.value;
  const mapping = SERVICE_MAP[service];

  setForm({
    ...form,
    serviceName: service,
    workerType: mapping.workerType,
    pricingType: mapping.pricingType,
  });
};



  /* -------- HANDLE INPUT -------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* -------- SUBMIT -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.serviceName || !form.price || !form.experienceYears) {
      setError("All fields are required");
      return;
    }

    const payload = {
  serviceName: form.serviceName,
  workerType: form.workerType,       
  pricingType: form.pricingType,     
  price: Number(form.price),
  experienceYears: Number(form.experienceYears),
};



    setLoading(true);
    try {
      if (workerProfileId) {
        await axiosInstance.put(
          `/api/workers/profile/${workerProfileId}`,
          payload
        );
        alert("Profile updated successfully");
      } else {
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
            value={form.serviceName}
            onChange={handleServiceChange}
            required
            style={styles.input}
          >
            <option value="">Select Service</option>
            <option value="ELECTRICIAN">Electrician</option>
            <option value="PLUMBER">Plumber</option>
            <option value="PAINTER">Painter</option>
            <option value="CARPENTER">Carpenter</option>
            <option value="LABOUR">Labour</option>
            <option value="MAID">Maid</option>
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

          {/* AUTO PRICING TYPE (READ ONLY) */}
          {form.pricingType && (
            <input
              value={`Pricing Type: ${form.pricingType}`}
              disabled
              style={{
                ...styles.input,
                background: "#f0f0f0",
                fontWeight: "bold",
              }}
            />
          )}

          {/* PRICE */}
          <input
            type="number"
            name="price"
            placeholder={
              form.pricingType === "MONTHLY"
                ? "Monthly Salary"
                : form.pricingType === "HOURLY"
                  ? "Hourly Rate"
                  : "Fixed Price"
            }
            value={form.price}
            onChange={handleChange}
            min="1"
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Saving..." : "Save Profile"}
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
