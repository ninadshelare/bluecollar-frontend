import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getServices, searchWorkers } from "../../api/jobApi";

const SearchWorkers = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [service, setService] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load service categories
  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch(() => alert("Failed to load services"));
  }, []);

  // Search workers by service
  const handleSearch = async () => {
    if (!service) {
      alert("Please select a service");
      return;
    }

    setLoading(true);
    try {
      const res = await searchWorkers({ service });
      setWorkers(res.data);
    } catch (err) {
      alert("Failed to search workers");
    } finally {
      setLoading(false);
    }
  };

  // Handle booking navigation
  const handleBook = (workerId) => {
    localStorage.setItem("selectedWorkerId", workerId);
    navigate("/customer/book");
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>Search Workers</h2>

        {/* Service Dropdown */}
        <div style={styles.searchBox}>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <button onClick={handleSearch} style={styles.button}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <hr />

        {/* Worker Results */}
        {workers.length === 0 && !loading && (
          <p>No workers found</p>
        )}

        {workers.map((w) => (
          <div key={w.id} style={styles.card}>
            <h4>{w.name}</h4>
            <p>⭐ Rating: {w.rating}</p>
            <p>Experience: {w.experienceYears} years</p>
            <p>Status: {w.available ? "Available" : "Busy"}</p>

            <button
              style={styles.bookButton}
              onClick={() => handleBook(w.id)}
            >
              Book Service
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchWorkers;

/* ---------- STYLES ---------- */

const styles = {
  container: {
    padding: 20,
    maxWidth: 800,
    margin: "auto",
  },
  searchBox: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },
  select: {
    padding: 10,
    flex: 1,
  },
  button: {
    padding: "10px 18px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  card: {
    border: "1px solid #ddd",
    padding: 16,
    marginTop: 12,
    borderRadius: 6,
    background: "#fafafa",
  },
  bookButton: {
    marginTop: 8,
    padding: "8px 14px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};
