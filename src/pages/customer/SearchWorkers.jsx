import { useState } from "react";
import Navbar from "../../components/Navbar";
import { searchWorkers } from "../../api/jobApi";
import { createWorkRequest } from "../../api/workRequestApi";

const SearchWorkers = () => {
  const customerId = localStorage.getItem("userId");

  const [filters, setFilters] = useState({
    service: "",
    pricingType: "",
    maxPrice: "",
    minRating: "",
  });

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    if (!filters.service) {
      alert("Please select a service");
      return;
    }

    const params = { service: filters.service, available: true };

    if (filters.pricingType) params.pricingType = filters.pricingType;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minRating) params.minRating = filters.minRating;

    setLoading(true);
    try {
      const res = await searchWorkers(params);
      setWorkers(res.data);
    } catch {
      alert("Failed to search workers");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (workerId) => {
    try {
      setBookingId(workerId);
      await createWorkRequest(customerId, workerId);
      alert("Service booked successfully! Waiting for worker acceptance.");
    } catch {
      alert("Failed to book service");
    } finally {
      setBookingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>Search Workers</h2>

        {/* FILTERS */}
        <div style={styles.filters}>
          <select name="service" onChange={handleChange}>
            <option value="">Select Service</option>
            <option value="ELECTRICIAN">Electrician</option>
            <option value="PLUMBER">Plumber</option>
            <option value="CARPENTER">Carpenter</option>
            <option value="PAINTER">Painter</option>
          </select>

          <select name="pricingType" onChange={handleChange}>
            <option value="">Any Pricing</option>
            <option value="HOURLY">Hourly</option>
            <option value="FIXED">Fixed</option>
          </select>

          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            onChange={handleChange}
          />

          <input
            type="number"
            name="minRating"
            placeholder="Min Rating"
            onChange={handleChange}
          />

          <button onClick={handleSearch}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <hr />

        {/* RESULTS */}
        {workers.length === 0 && !loading && <p>No workers found</p>}

        {workers.map((w) => (
          <div key={w.workerId} style={styles.card}>
            <h4>{w.name}</h4>
            <p>⭐ Rating: {w.rating}</p>
            <p>Experience: {w.experienceYears} years</p>
            <p>Status: {w.available ? "Available" : "Busy"}</p>

            <button
              onClick={() => handleBook(w.workerId)}
              disabled={!w.available || bookingId === w.workerId}
              style={styles.bookBtn}
            >
              {bookingId === w.workerId ? "Booking..." : "Book Service"}
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
    maxWidth: 900,
    margin: "auto",
  },
  filters: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    border: "1px solid #ccc",
    padding: 14,
    marginTop: 10,
    borderRadius: 6,
  },
  bookBtn: {
    marginTop: 10,
    padding: "8px 14px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
