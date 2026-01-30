import { useState } from "react";
import Navbar from "../../components/Navbar";
import { searchWorkers } from "../../api/jobApi";

const SearchWorkers = () => {
  const [filters, setFilters] = useState({
    service: "",
    pricingType: "",
    maxPrice: "",
    minRating: "",
  });

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    if (!filters.service) {
      alert("Please select a service");
      return;
    }

    const params = { service: filters.service };

    if (filters.pricingType) params.pricingType = filters.pricingType;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minRating) params.minRating = filters.minRating;

    setLoading(true);
    try {
      const res = await searchWorkers(params);
      setWorkers(res.data);
    } catch (err) {
      alert("Failed to search workers");
    } finally {
      setLoading(false);
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
        {workers.length === 0 && !loading && (
          <p>No workers found</p>
        )}

        {workers.map((w) => (
          <div key={w.id} style={styles.card}>
            <h4>{w.name}</h4>
            <p>⭐ Rating: {w.rating}</p>
            <p>Experience: {w.experienceYears} years</p>
            <p>Status: {w.available ? "Available" : "Busy"}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchWorkers;

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
};
