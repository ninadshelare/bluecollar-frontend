import { useState } from "react";
import Navbar from "../../components/Navbar";
import { searchWorkers } from "../../api/jobApi";
import { createWorkRequest } from "../../api/workRequestApi";

const SearchWorkers = () => {
  const customerId = localStorage.getItem("userId");

  const [filters, setFilters] = useState({
    service: "",
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

    setLoading(true);
    try {
      const res = await searchWorkers({
        service: filters.service,
        available: true,
      });

      console.log("SEARCH RESPONSE 👉", res.data);

      setWorkers(res.data);
    } catch (err) {
      console.error("SEARCH ERROR 👉", err.response?.data || err.message);
      alert("Failed to search workers");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (workerId) => {
    try {
      setBookingId(workerId);

      const cid = Number(customerId);
      const wid = Number(workerId);

      if (!cid || !wid) {
        alert("Invalid customer or worker ID");
        return;
      }

      await createWorkRequest(cid, wid);

      alert("Service booked successfully!");
    } catch (err) {
      console.error("BOOK ERROR 👉", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to book service");
    } finally {
      setBookingId(null);
    }
  };


  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>Search Workers</h2>

        {/* FILTER */}
        <div style={styles.filters}>
          <select name="service" onChange={handleChange}>
            <option value="">Select Service</option>
            <option value="ELECTRICIAN">Electrician</option>
            <option value="PLUMBER">Plumber</option>
            <option value="PAINTER">Painter</option>
            <option value="CARPENTER">Carpenter</option>
            <option value="LABOUR">Labour</option>
            <option value="MAID">Maid</option>
          </select>

          <button onClick={handleSearch}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <hr />

        {/* RESULTS */}
        {workers.length === 0 && !loading && <p>No workers found</p>}

        {workers.map((w) => {
          const pricing = w.pricing?.[0];

          return (
            <div key={w.workerId} style={styles.card}>
              <h4>{w.name}</h4>
              <p>⭐ Rating: {w.rating ?? "N/A"}</p>
              <p>Experience: {w.experienceYears} years</p>
              <p>Status: {w.available ? "Available" : "Busy"}</p>

              {pricing ? (
                <p>
                  <b>Price:</b> ₹{pricing.price}{" "}
                  <small>({pricing.pricingType})</small>
                </p>
              ) : (
                <p style={{ color: "gray" }}>Pricing not available</p>
              )}

              <button
                onClick={() => handleBook(w.workerId)}
                disabled={!w.available || bookingId === w.workerId}
                style={styles.bookBtn}
              >
                {bookingId === w.workerId ? "Booking..." : "Book Service"}
              </button>
            </div>
          );
        })}

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
    display: "flex",
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
