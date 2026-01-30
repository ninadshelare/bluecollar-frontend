import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const WorkerProfileSetup = () => {
  const navigate = useNavigate();
  const workerId = localStorage.getItem("userId");

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [form, setForm] = useState({
    service: "",
    experienceYears: "",
    pricingType: "HOURLY",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- FETCH SERVICES ---------------- */
  useEffect(() => {
    axiosInstance
      .get("/api/services")
      .then((res) => setServices(res.data))
      .catch(() => setError("Failed to load services"))
      .finally(() => setLoadingServices(false));
  }, []);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- SUBMIT PROFILE ---------------- */
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.service || !form.experienceYears || !form.price) {
    setError("All fields are required");
    return;
  }

  const payload = {
    serviceName: form.service,
    pricingType: form.pricingType,
    price: Number(form.price),
    experienceYears: Number(form.experienceYears),
  };

  setLoading(true);
  try {
    await axiosInstance.post(
      "/api/workers/profile",
      payload,
      { params: { userId: workerId } }
    );

    alert("Profile completed successfully!");
    navigate("/worker");
  } catch (err) {
    console.error(err);
    setError("Failed to save profile");
  } finally {
    setLoading(false);
  }
};


  /* ---------------- UI ---------------- */
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>Complete Worker Profile</h2>

        {error && <p style={styles.error}>{error}</p>}

        {loadingServices ? (
          <p>Loading services...</p>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* SERVICE */}
            <select
              name="service"
              value={form.service}
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

            <button
              type="submit"
              disabled={loading}
              style={styles.button}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default WorkerProfileSetup;

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    padding: 20,
    maxWidth: 500,
    margin: "auto",
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
